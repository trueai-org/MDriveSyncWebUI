import {
  SmileFilled,
  SettingFilled,
  InfoCircleFilled,
  GithubFilled,
} from "@ant-design/icons";

export default {
  route: {
    path: "/",
    routes: [
      {
        path: "/welcome",
        name: "欢迎",
        icon: <SmileFilled />,
      },

      {
        path: "/setting",
        name: "设置",
        icon: <SettingFilled />,
      },
      {
        path: "/about",
        name: "关于",
        icon: <InfoCircleFilled />,
      },
      {
        path: "https://github.com/trueai-org/MDriveSync",
        name: "官网",
        icon: <GithubFilled />,
      },
    ],
  },
  location: {
    pathname: "/",
  },
};
