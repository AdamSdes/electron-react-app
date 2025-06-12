const { build } = require('electron-builder');
const path = require('path');

async function buildApp() {
  try {
    console.log('Starting local build...');
    
    await build({
      targets: [
        {
          platform: 'win32',
          arch: 'x64'
        }
      ],
      config: {
        appId: 'com.guasam.era',
        productName: 'ElectronReactApp',
        directories: {
          buildResources: 'resources/build',
          output: 'dist'
        },
        files: [
          'lib/**/*',
          'app/**/*',
          'resources/**/*',
          'package.json'
        ],
        win: {
          target: 'nsis',
          icon: 'resources/build/icon.ico'
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },
        compression: 'store',
        publish: null
      }
    });
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildApp();
