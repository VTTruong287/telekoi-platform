import * as fs from 'fs';
import * as path from 'path';
import { webpack } from 'webpack';
import yargs from 'yargs';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const argv: any = yargs(process.argv).options({
  target: { type: 'string' },
  stage: { type: 'string', default: 'dev' }
}).argv;

const STAGE = argv.stage as any;
const TARGET = argv.target;

function bundleLambdaFunction(
  entries: { [name: string]: string },
  distDir: string,
  mode: 'none' | 'development' | 'production'
) {
  return new Promise((resolve, reject) => {
    webpack(
      {
        mode,
        entry: entries,
        output: {
          path: distDir,
          filename: '[name]/[name].js',
          libraryTarget: 'commonjs2',
          clean: false,
        },
        devtool: false,
        target: 'node',
        externals: [
          {
            electron: 'electron',
            'aws-sdk': 'aws-sdk',
            '@google-cloud/storage': 'commonjs @google-cloud/storage',
          },
        ],
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              use: 'ts-loader',
              exclude: /node_modules/,
            },
          ],
        },
        resolve: {
          extensions: ['.js', '.jsx', '.json', '.tsx', '.ts'],
          plugins: [
            new TsconfigPathsPlugin({

            })
          ]
        },
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          if (result && result?.compilation.errors.length) {
            console.warn(result.compilation.errors);
          }

          resolve(result);
        }
      }
    );
  });
}

function findLambdaEntries (sourceDir: string): { [name: string]: string } {
  const fileList = fs.readdirSync(sourceDir);

  const entries: any = {};
  for (const fileName of fileList) {
    if (fileName.startsWith('index') && fileName.endsWith('.ts')) {
      const [_, entryName] = fileName.split('.');
      entries[entryName] = path.join(sourceDir, fileName);
    }
  }

  return entries;
}

async function main () {
  const sourceDir = path.resolve(__dirname, TARGET, 'src');
  const distDir = path.resolve(__dirname, TARGET, '.dist');
  const lambdaEntries = findLambdaEntries(sourceDir);
  await bundleLambdaFunction(lambdaEntries, distDir, STAGE === 'prod' ? 'production' : 'development');
}

main();
