import minimist from "minimist";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import esbuild from "esbuild";
import { createRequire } from "module";

// 解析命令行参数
const args = minimist(process.argv.slice(2));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// 获取目标模块名称和打包格式
const target = args._[0] || "danmaku"; // 默认打包 danmaku 模块
const format = args.f || "esm"; // 默认打包为 ES 模块

// 解析目标模块的入口文件和 package.json
const entry = resolve(__dirname, "../packages", target, "src/index.ts");
const pkg = require(`../packages/${target}/package.json`);

// 定义输出文件路径
const outfile = resolve(
  __dirname,
  "../packages",
  target,
  `dist/${target}.${format === "cjs" ? "cjs" : format === "esm" ? "esm" : "umd"}.js`
);

// 定义全局变量名（仅适用于 iife 格式）
const globalName = pkg.buildOptions?.name || "Danmaku";

// 配置 esbuild
esbuild
  .context({
    entryPoints: [entry], // 入口文件
    outfile, // 输出文件
    bundle: true, // 打包所有依赖
    platform: format === "cjs" ? "node" : "browser", // 平台
    sourcemap: true, // 生成 sourcemap
    // format, // 模块格式
    format:'cjs', // 模块格式
    globalName: format === "iife" ? globalName : undefined, // iife 格式的全局变量名
  })
  .then((ctx) => {
    console.log(`Building ${target} in ${format} format...`);
    return ctx.watch(); // 监听文件变化并重新打包
  })
  .then(() => {
    console.log("Build success! Watching for changes...");
  })
  .catch((err) => {
    console.error("Build failed:", err);
    process.exit(1);
  });