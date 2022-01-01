'use babel';

import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';
import { CompositeDisposable } from 'atom';
import { spawn } from 'child_process';

import meta from '../package.json';

export const config = require('./config');

export function activate() {
  if (atom.config.get(meta.name + '.manageDependencies') === true) {
    require('atom-package-deps').install(meta.name)
    .then(function() {
      if (atom.packages.isPackageDisabled("build"))
        atom.packages.enablePackage("build")
    });
  }
}

// checks if the project is a clickable project by looking for clickable.json or clickable.yaml
export function provideBuilder() {
  return class ClickableProvider extends EventEmitter {
    subscriptions: null
    clickableFile: null

    constructor(cwd) {
      super();
      this.cwd = cwd;
      this.subscriptions = new CompositeDisposable();
      //old clickable6 projects may still use clickable.json, not yet clickable.yaml
      if (fs.existsSync(path.join(this.cwd, 'clickable.json'))) {
          this.clickableFile = path.join(this.cwd, 'clickable.json');
      } else if (fs.existsSync(path.join(this.cwd, 'clickable.yaml'))) {
          this.clickableFile = path.join(this.cwd, 'clickable.yaml');
      } else {
          this.clickableFile = null;
      }

      // create menu when either clickable.json or clickable.yaml are present OR when the option is set
      if (this.isEligible()) {
        this.createMenu()
      }
    }

    createMenu() {
      if (this.clickableFile) {
          var clickableManifest = fs.realpathSync(this.clickableFile);
          delete require.cache[clickableManifest];
          var manifest = require(clickableManifest);

          var menuTemplate = [{
            label: 'Clickable',
            submenu: [{
              label: 'Open shell [phone]',
              command: 'clickable:openshell'
            },
            {
              label: 'clickable logs',
              command: 'clickable:logs'
            }]
          }]

          var commandsTemplate = {
            'clickable:openshell': () => {
              this.spawnTerminal('shell');
            },
            'clickable:logs': () => {
              this.spawnTerminal('logs');
            }
          }

          if (manifest.scripts) {
            for (var key in manifest.scripts) {
              menuTemplate[0].submenu.push({
                label: 'Project command: Run \'' + key + '\'',
                command: 'clickable:custom_' + key
              });

              commandsTemplate["clickable:custom_" + key] = () => {
                this.spawnTerminal(key);
              }
            }
          }

          this.subscriptions.add(
            atom.commands.add('atom-workspace', commandsTemplate)
          );

          atom.menu.add(menuTemplate);
      }
    }

    spawnTerminal(cmd) {
      spawn(atom.config.get(meta.name + '.terminalExec'), ['-e', 'clickable', cmd], { cwd: this.cwd });
    }

    destructor() {
      this.subscriptions.dispose();
    }

    getNiceName() {
      return 'Clickable';
    }

    isEligible() {
      if (atom.config.get(meta.name + '.alwaysEligible') === true) {
        return true;
      } else {
      return fs.existsSync(this.clickableFile);
      }
    }

    clickArgsBuilder(isDesktop, targetArch) {
        let args = []  //let specifies a local variable
        // for arguments containing spaces like --lang en_GB
        // push both parts separated to the array
        // the space will get added when parsing the arguments
        if (isDesktop) {
            args.push('desktop')
        }
        if (targetArch.length > 0 && !isDesktop) {
          args.push('--arch')
          args.push(targetArch)
        }
        if (atom.config.get(meta.name + '.cleanBuild') === true) {
          args.push('--clean')
        }
        if (atom.config.get(meta.name + '.clickableVerbose') === true) {
          args.push('--verbose')
        }
        if (atom.config.get(meta.name + '.desktopDarkMode') === true && isDesktop) {
          args.push('--dark-mode')
        }
        if (atom.config.get(meta.name + '.desktopLang').length > 0 && atom.config.get(meta.name + '.desktopLang') != "system language" && isDesktop) {
          args.push('--lang')
          args.push(atom.config.get(meta.name + '.desktopLang'))
        }
        if (atom.config.get(meta.name + '.desktopNvidia') === true && isDesktop) {
          args.push('--nvidia')
        }

        // only needed if several commands are chained
        // if (args.length > 0) {
        //     args.unshift("chain") //add chain as first value
        // } .split(',') .join(" ")
        return args
    }

    settings() {
      const errorHelper = require('./check_errors');
      var customArgs = atom.config.get(meta.name + '.customClickable').split(",")
      customArgs = customArgs.concat(this.clickArgsBuilder(false,''))  //does not work with .push()

      return [{
        name: 'Clickable: Build and run [desktop]',
        exec: 'clickable',
        args: this.clickArgsBuilder(true,''),
        sh: false,
        functionMatch: function (terminal_output) {
          return errorHelper.checkBuildError(terminal_output, this.clickableFile)
        }
      },
      {
        name: 'Clickable: Build and run arm64 [phone]',
        exec: 'clickable',
        args: this.clickArgsBuilder(false,'arm64'),
        sh: false,
        functionMatch: function (terminal_output) {
          return errorHelper.checkBuildError(terminal_output, this.clickableFile)
        }
      },
      {
        name: 'Clickable: Build and run armhf [phone]',
        exec: 'clickable',
        args: this.clickArgsBuilder(false,'armhf'),
        sh: false,
        functionMatch: function (terminal_output) {
          return errorHelper.checkBuildError(terminal_output, this.clickableFile)
        }
      },
      {
        name: 'Clickable: Build and run arch host/arch all [phone]',
        exec: 'clickable',
        args: this.clickArgsBuilder(false,''),
        sh: false,
        functionMatch: function (terminal_output) {
          return errorHelper.checkBuildError(terminal_output, this.clickableFile)
        }
      },
      {
        name: 'Clickable: custom [' + atom.config.get(meta.name + '.customClickable') + ']',
        exec: 'clickable',
        args: customArgs,
        sh: false,
        functionMatch: function (terminal_output) {
          return errorHelper.checkBuildError(terminal_output, this.clickableFile)
        }
      },
      {
        name: 'Clickable: Review [click package]',
        exec: 'clickable',
        args: [ 'review' ],
        sh: false,
        functionMatch: function (terminal_output) {
          return errorHelper.checkBuildError(terminal_output, this.clickableFile)
        }
      },
      {
        name: 'Clickable: Update [docker container]',
        exec: 'clickable',
        args: [ 'update' ],
        sh: false,
        functionMatch: function (terminal_output) {
          return errorHelper.checkBuildError(terminal_output, this.clickableFile)
        }
      }];
    }
  }
}
