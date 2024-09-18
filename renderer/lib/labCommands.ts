export const labCommands = [
  {
    label: "types list",
    value: "types list",
    description: "List all types",
    options: [
      {
        name: "--output",
        type: "argument",
        placeholder: "<OUTPUT>",
        description:
          "[default: plain] [possible values: plain, json, json-formatted]",
      },
      {
        name: "--help",
        type: "flag",
        description: "Print help",
      },
    ],
  },
  {
    label: "guess",
    value: "guess",
    args: [],
    options: [
      {
        name: "--input",
        type: "argument",
        placeholder: "<INPUT>",
        description:
          "[default: single-base64] [possible values: single, single-base64, stream, stream-base64, stream-framed]",
      },
      {
        name: "--output",
        type: "argument",
        placeholder: "<OUTPUT>",
        description: "[default: list] [possible values: list]",
      },
      {
        name: "--certainty",
        type: "argument",
        placeholder: "<CERTAINTY>",
        description: "Certainty as an arbitrary value [default: 2]",
      },
      {
        name: "--help",
        type: "flag",
        description: "Print help",
      },
    ],
  },
  {
    label: "decode",
    value: "decode",
    description: "Decode XDR",
    args: [],
    options: [
      {
        name: "--type",
        type: "argument",
        placeholder: "<TYPE>",
        description: "XDR type to decode",
      },
      {
        name: "--input",
        type: "argument",
        placeholder: "<INPUT>",
        description:
          "[default: stream-base64] [possible values: single, single-base64, stream, stream-base64, stream-framed]",
      },
      {
        name: "--output",
        type: "argument",
        placeholder: "<OUTPUT>",
        description: "[default: json] [possible values: json, json-formatted]",
      },
      {
        name: "--help",
        type: "flag",
        description: "Print help",
      },
    ],
  },
  {
    label: "encode",
    value: "encode",
    description: "Encode XDR",
    args: [],
    options: [
      {
        name: "--type",
        type: "argument",
        placeholder: "<TYPE>",
        description: "XDR type to decode",
      },
      {
        name: "--input",
        type: "argument",
        placeholder: "<INPUT>",
        description: "[default: json] [possible values: json]",
      },
      {
        name: "--output",
        type: "argument",
        placeholder: "<OUTPUT>",
        description:
          "[default: single-base64] [possible values: single, single-base64]",
      },
      {
        name: "--help",
        type: "flag",
        description: "Print help",
      },
    ],
  },
  {
    label: "version",
    value: "version",
    description: "Print version",
    options: [
      {
        name: "--help",
        type: "flag",
        description: "Print help",
      },
    ],
  },
];
