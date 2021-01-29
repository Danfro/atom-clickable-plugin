'use babel';

export default {
  terminalExec: {
    title: 'Terminal exec',
    description: 'Set your favorite terminal application',
    type: 'string',
    default: 'x-terminal-emulator',
    order: 0
  },
  customClickable: {
    title: 'Custom clickable parameters',
    description: 'Set parameters for custom clickable command [comma separated, no spaces, including -- for parameters e.g. "--arch,arm64"]',
    type: 'string',
    default: '--dirty,--arch,arm64',
    order: 1
  },
  manageDependencies: {
    title: 'Manage Dependencies',
    description: 'When enabled, third-party dependencies will be installed automatically',
    type: 'boolean',
    default: true,
    order: 2
  },
  alwaysEligible: {
    title: 'Always Eligible',
    description: 'The build provider will be available in your project, even when not eligible',
    type: 'boolean',
    default: false,
    order: 3
  }
};
