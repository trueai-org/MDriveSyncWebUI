import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  InputNumber,
  Button,
  Steps,
  message,
  TreeSelect,
  TreeSelectProps,
} from "antd";
import { FolderOutlined } from "@ant-design/icons";
import { IDriveJob } from "@/api/model";
import { getCronTags, getPaths } from "@/api";
import { DefaultOptionType } from "antd/es/select";

const { Step } = Steps;
const { SHOW_PARENT } = TreeSelect;

interface JobEditModalProps {
  visible: boolean;
  onOk: (job: IDriveJob) => void;
  onCancel: () => void;
  jobConfig: IDriveJob;
}

const JobEditModal: React.FC<JobEditModalProps> = ({
  visible,
  onOk,
  onCancel,
  jobConfig,
}) => {
  const [form] = Form.useForm<IDriveJob>();
  const [currentStep, setCurrentStep] = useState(0);
  const [allStepsData, setAllStepsData] = useState<IDriveJob>();
  const [msg, contextHolder] = message.useMessage();
  const [saveing, setSaveing] = useState(false);
  const [cronTags, setCronTags] = useState<string[]>([]);

  useEffect(() => {
    getCronTags().then((res) => {
      setCronTags(res);
    });
    getPaths().then((res) => {
      if (res.success) {
        const vs = res.data!.map((x) => {
          return {
            title: x.text,
            label: x.text,
            value: x.id,
            key: x.id,
            children: [],
            icon: <FolderOutlined />,
          };
        });
        setPaths(vs);
      }
    });
  }, []);

  useEffect(() => {
    if (form && visible) {
      setAllStepsData(jobConfig);
      form.setFieldsValue(jobConfig);
      setValue(jobConfig.sources || []);
    }
  }, [visible, jobConfig, form]);

  const updateStepData = () => {
    form.validateFields().then((values) => {
      setAllStepsData({ ...allStepsData, ...values });
    });
  };

  const next = () => {
    form
      .validateFields()
      .then((values) => {
        setAllStepsData({ ...allStepsData, ...values });
        setCurrentStep(currentStep + 1);
      })
      .catch((errorInfo) => {
        msg.error(errorInfo?.errorFields[0].errors[0]);
      });
  };

  const prev = () => {
    form
      .validateFields()
      .then((values) => {
        setAllStepsData({ ...allStepsData, ...values });
        setCurrentStep(currentStep - 1);
      })
      .catch((errorInfo) => {
        msg.error(errorInfo?.errorFields[0].errors[0]);
      });
  };

  const handleSubmit = () => {
    setSaveing(true);
    form
      .validateFields()
      .then((values) => {
        const value: IDriveJob = { ...allStepsData, ...values };
        setAllStepsData(value);
        onOk && onOk(value);
      })
      .catch((errorInfo) => {
        msg.error(errorInfo?.errorFields[0].errors[0]);
      })
      .finally(() => {
        setSaveing(false);
      });
  };

  // 树下拉选择框
  const [showTreeSelect, setShowTreeSelect] = useState(true);
  const [value, setValue] = useState<string[]>(() => {
    return jobConfig?.sources || [];
  });
  const [paths, setPaths] = useState<DefaultOptionType[]>([]);
  const onChange = (newValue: string[]) => {
    setValue(newValue);
    setAllStepsData((prev) => {
      if (prev) {
        prev.sources = newValue;
      }
      return prev;
    });
  };
  const onLoadData: TreeSelectProps["loadData"] = async (node) => {
    try {
      const res = await getPaths(node.key as string);
      if (res.success) {
        const childNodes = res.data?.map((x) => ({
          title: x.text,
          label: x.text,
          value: x.id,
          key: x.id,
          children: [],
          icon: <FolderOutlined />,
        }));

        setPaths((prevPaths) => {
          return prevPaths.map((path) =>
            path.key === node.key ? { ...path, children: childNodes } : path
          );
        });
      }
    } catch (error) {
      message.error("加载子文件夹时出错");
    }
  };

  return (
    <Modal
      title="作业配置"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={760}
      footer={[
        <Button
          loading={saveing}
          key="submit"
          type="primary"
          onClick={handleSubmit}
        >
          保存
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
      ]}
      className="w-full"
    >
      {contextHolder}
      <Steps
        className="py-3"
        onChange={(e) => {
          updateStepData();
          setCurrentStep(e);
        }}
        current={currentStep}
      >
        <Step title="基本信息" />
        <Step title="作业配置" />
        <Step title="高级设置" />
      </Steps>

      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        {currentStep == 0 && (
          <>
            <Form.Item required name="id" label="作业标识">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="name"
              label="作业名称"
              rules={[{ required: true, message: "请输入任务/作业名称" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="作业描述">
              <Input />
            </Form.Item>
            <Form.Item
              name="schedules"
              label="作业计划"
              help={
                <span>
                  更多示例：
                  <a
                    href="https://www.bejson.com/othertools/cron/"
                    target="_blank"
                  >
                    Cron 表达式
                  </a>
                  ，支持自定义作业时间，示例：0 15 10 * * ?。
                </span>
              }
            >
              <Select
                options={cronTags?.map((x) => {
                  return { value: x };
                })}
                mode="tags"
                tokenSeparators={[","]}
              />
            </Form.Item>
            <Form.Item
              name="mode"
              label="同步模式"
              help="镜像：以本地为主，如果远程和本地不一致则删除远程文件；备份：以本地为主，将本地备份到远程，不删除远程文件；双向：双向同步，同时保留，冲突的文件重新命名。"
            >
              <Select>
                <Select.Option value={0}>镜像</Select.Option>
                <Select.Option value={1}>备份</Select.Option>
                <Select.Option value={2}>双向</Select.Option>
              </Select>
            </Form.Item>
          </>
        )}
        {currentStep == 1 && (
          <>
            <Form.Item
              required
              label="本地目录"
              tooltip="源路劲、本地路径，请选择本地文件夹"
              help="请选择或输入本地文件夹，支持多选，例如：E:\test, E:\kopia"
            >
              {showTreeSelect ? (
                <TreeSelect
                  treeData={paths}
                  onChange={onChange}
                  treeCheckable
                  style={{
                    width: "100%",
                  }}
                  allowClear
                  placeholder={"请选择文件夹"}
                  showCheckedStrategy={SHOW_PARENT}
                  value={value}
                  loadData={onLoadData}
                />
              ) : (
                <Select
                  onChange={onChange}
                  value={value}
                  mode="tags"
                  allowClear
                  tokenSeparators={[",", "，"]}
                  placeholder={"请输入粘贴文件夹路径"}
                />
              )}
              <span
                className="cursor-pointer text-blue-500 block py-1"
                onClick={() => {
                  setShowTreeSelect(!showTreeSelect);
                }}
              >
                {showTreeSelect
                  ? "切换为输入文件夹"
                  : "切换为选择文件夹，多个以逗号分割"}
              </span>
            </Form.Item>

            <Form.Item
              required
              name="defaultDrive"
              label="目标位置"
              tooltip="阿里云盘的存储位置，个人私有文件建议存储到备份盘"
            >
              <Select>
                <Select.Option value="resource">资源库</Select.Option>
                <Select.Option value="backup">备份盘</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              required
              name="target"
              label="目标目录"
              tooltip="云盘存储路径，远程备份/同步存储的路径"
              help="路径格式：/文件夹/文件夹/文件夹，示例：backup/mdrive"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="filters"
              label="过滤文件"
              tooltip="排除本地不需要过滤的文件/文件夹"
              help={
                <>
                  <div>
                    支持正则表达式，多个文件/文件夹用逗号分隔，过滤的文件/文件夹不会同步
                  </div>
                  <div>
                    示例：/Recovery/*, *.log, *.tmp, **/@Recycle/*,
                    **/logs/*，更多示例请参考官网。
                  </div>
                </>
              }
            >
              <Select mode="tags" tokenSeparators={[",", "，"]} />
            </Form.Item>
            <Form.Item
              name="restore"
              label="还原目录"
              tooltip="还原文件时的本地文件夹"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="rapidUpload"
              label="启用秒传"
              valuePropName="checked"
              tooltip="是否启用阿里云盘秒传功能"
            >
              <Checkbox />
            </Form.Item>
          </>
        )}
        {currentStep == 2 && (
          <>
            <Form.Item
              name="checkAlgorithm"
              tooltip="文件是否变更检查算法"
              label="文件对比检查算法"
            >
              <Select>
                <Select.Option value="md5">MD5</Select.Option>
                <Select.Option value="sha1">SHA1</Select.Option>
                <Select.Option value="sha256">SHA256</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="checkLevel"
              label="文件对比检查级别"
              tooltip="文件变更时，文件是否变动检查算法级别，默认：1"
              help={
                <span>
                  0：比较文件大小和时间，1：采样计算文件
                  hash（推荐），2：比较整个文件的 hash
                  <br />
                  3：比较文件头部 hash，4：比较文件尾部 hash
                </span>
              }
            >
              <InputNumber min={0} max={4} />
            </Form.Item>
            <Form.Item
              name="fileWatcher"
              label="启用文件系统监听"
              valuePropName="checked"
              tooltip="启用监听可以更加快捷的计算需要同步的文件"
            >
              <Checkbox />
            </Form.Item>
            <Form.Item name="order" label="显示顺序" tooltip="作业显示顺序">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item
              name="isTemporary"
              label="立即执行"
              tooltip="是否为临时作业，也表示是否立即执行作业"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
            <Form.Item
              name="isRecycleBin"
              label="启用回收站"
              tooltip="是否启用回收站，如果启用则删除文件时，保留到回收站"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
            <Form.Item
              name="uploadThread"
              label="上传并行任务数"
              tooltip="上传并行任务数（0：自动，最大：10）"
            >
              <InputNumber min={0} max={10} />
            </Form.Item>
            <Form.Item
              name="downloadThread"
              label="下载并行任务数"
              tooltip="下载并行任务数（0：自动，最大：10）"
            >
              <InputNumber min={0} max={10} />
            </Form.Item>
          </>
        )}
      </Form>

      <div className="pt-3 items-center justify-center w-full flex">
        {currentStep > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            上一步
          </Button>
        )}
        {currentStep < 2 && (
          <Button ghost type="primary" onClick={() => next()}>
            下一步
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default JobEditModal;
