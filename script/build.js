import minimist from "minimist";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import esbuild from "esbuild";
import { createRequire } from "module";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// 解析命令行参数
const args = minimist(process.argv.slice(2));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// 获取目标模块名称
const target = args._[0] || "danmaku"; // 默认打包 danmaku 模块

// 解析目标模块的入口文件和 package.json
const entry = resolve(__dirname, "../packages", target, "src/index.ts");
const pkg = require(`../packages/${target}/package.json`);

// 定义全局变量名（仅适用于 iife 格式）
const globalName = pkg.buildOptions?.name || "Danmaku";

// 定义打包格式
const formats = ["cjs", "esm", "iife"];

// 打包函数
async function build() {
  try {
    // 生成类型声明文件
    console.log("Generating type declarations...");
    // execSync('tsc .\\packages\\danmaku\\src\\index.ts --emitDeclarationOnly --declaration --outDir .\\packages\\danmaku\\dist');
    execSync('tsc --p ./packages/danmaku')
    moveFilesRecursively(resolve(__dirname, "../packages/danmaku/dist/src"), resolve(__dirname, "../packages/danmaku/dist"))
    // 遍历所有格式并打包
    for (const format of formats) {
      console.log(`Building ${target} in ${format} format...`);

      // 定义输出文件路径
      const outfile = resolve(
        __dirname,
        "../packages",
        target,
        `dist/${target}.${format === "cjs" ? "cjs" : format === "esm" ? "esm" : "umd"}.${format === 'esm' ? 'mjs' : 'js'}`
      );

      // 配置 esbuild
      const ctx = await esbuild.context({
        entryPoints: [entry], // 入口文件
        outfile, // 输出文件
        bundle: true, // 打包所有依赖
        platform: format === "cjs" ? "node" : "browser", // 平台
        sourcemap: true, // 生成 sourcemap
        format, // 模块格式
        globalName: format === "iife" ? globalName : undefined, // iife 格式的全局变量名
      });

      console.log(`Build success: ${outfile}`);
      ctx.watch();
    }

    console.log("All builds completed!");
  } catch (err) {
    console.error("Build failed:", err);
    process.exit(1);
  }
}

// 执行打包
build();

function moveFilesRecursively(srcDir, destDir) {
  // 确保目标文件夹存在
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // 读取源文件夹中的所有文件和子文件夹
  const items = fs.readdirSync(srcDir);

  for (const item of items) {
    const srcPath = path.join(srcDir, item); // 源文件或文件夹的路径
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // 如果是文件夹，递归处理
      moveFilesRecursively(srcPath, destDir);
      // 删除空文件夹
      if (fs.readdirSync(srcPath).length === 0) {
        fs.rmdirSync(srcPath);
      }
    } else {
      // 如果是文件，移动到目标文件夹，并铺平文件结构
      const fileName = path.basename(srcPath); // 获取文件名
      const destPath = path.join(destDir, fileName); // 目标文件路径

      // 如果目标文件夹中已存在同名文件，可以选择覆盖或重命名
      if (fs.existsSync(destPath)) {
        console.warn(`File already exists: ${destPath}. Skipping...`);
        continue; // 跳过已存在的文件
      }

      fs.renameSync(srcPath, destPath);
      console.log(`Moved: ${srcPath} -> ${destPath}`);
    }
  }
}