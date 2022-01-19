'use babel';

export default {
  customClickable: {
    title: 'Clickable: custom clickable parameters',
    description: 'Set parameters for custom clickable command [comma separated, no spaces, including -- for parameters e.g. "--arch,arm64"]. This will run "clickable chain *commands*". The options --clean and --verbose are added as set below.',
    type: 'string',
    default: 'desktop,--lang,en_EN,--dark-mode',
    order: 0
  },
  cleanBuild: {
    title: 'Clickable: clear build directory prior to build',
    description: 'Clear the build directory when running "clickable". This was the default before clickable 7.',
    type: 'boolean',
    default: true,
    order: 1
  },
  clickableVerbose: {
    title: 'Clickable: use --verbose parameter',
    description: 'Run clickable with the --verbose parameter to get more detailed output for debugging.',
    type: 'boolean',
    default: false,
    order: 2
  },
  desktopDarkMode: {
    title: 'Clickable desktop: use dark-mode for clickable desktop',
    description: 'Make clickable desktop use the dark theme.',
    type: 'boolean',
    default: true,
    order: 3
  },
  desktopLang: {
      title: 'Clickable desktop: use specified language for clickable desktop',
      description: 'Make clickable desktop use the --lang parameter with the specified language. Syntax is *language code*_*country code* e.g. en_GB',
      type: 'string',
      default: "system language",
      order: 4
  },
  desktopNvidia: {
    title: 'Clickable desktop: enforce --nvidia parameter for clickable desktop',
    description: 'Make clickable desktop enforce the --nvidia parameter, disabling automatic detection.',
    type: 'boolean',
    default: false,
    order: 5
  },
  // clickableSSH: {
  //   title: 'Specify ip address to be used with the --ssh parameter',
  //   description: 'Run clickable with the --verbose parameter to get more detailed output for debugging.',
  //   type: 'string',
  //   default: "<ip address>",
  //   order: 3
  // },
  terminalExec: {
    title: 'General: Terminal exec',
    description: 'Set your favorite terminal application',
    type: 'string',
    default: 'x-terminal-emulator',
    order: 6
  },
  manageDependencies: {
    title: 'General: Manage Dependencies',
    description: 'When enabled, third-party dependencies will be installed automatically',
    type: 'boolean',
    default: true,
    order: 7
  }
};
