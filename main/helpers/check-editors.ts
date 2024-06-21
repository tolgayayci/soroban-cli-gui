const fs = require("fs");

export const checkEditors = async () => {
  const editors = [
    {
      name: "Visual Studio Code",
      command: "code",
      paths: [
        "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code",
        "/usr/local/bin/code",
        "/usr/bin/code",
        "C:\\Program Files\\Microsoft VS Code\\bin\\code.cmd",
        "C:\\Program Files (x86)\\Microsoft VS Code\\bin\\code.cmd",
      ],
    },
    {
      name: "WebStorm",
      command: "webstorm",
      paths: [
        "/Applications/WebStorm.app/Contents/MacOS/webstorm",
        "/usr/local/bin/webstorm",
        "/usr/bin/webstorm",
        "C:\\Program Files\\JetBrains\\WebStorm\\bin\\webstorm.bat",
        "C:\\Program Files (x86)\\JetBrains\\WebStorm\\bin\\webstorm.bat",
      ],
    },
    {
      name: "CLion",
      command: "clion",
      paths: [
        "/Applications/CLion.app/Contents/MacOS/clion",
        "/usr/local/bin/clion",
        "/usr/bin/clion",
        "C:\\Program Files\\JetBrains\\CLion\\bin\\clion.bat",
        "C:\\Program Files (x86)\\JetBrains\\CLion\\bin\\clion.bat",
      ],
    },
  ];

  const installedEditors = [];

  for (const editor of editors) {
    for (const execPath of editor.paths) {
      if (fs.existsSync(execPath)) {
        installedEditors.push({
          name: editor.name,
          command: editor.command,
          path: execPath,
        });
        break;
      }
    }
  }

  return installedEditors;
};
