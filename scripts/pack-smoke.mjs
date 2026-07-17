import { execFileSync } from "node:child_process"
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const temporaryRoot = mkdtempSync(join(tmpdir(), "wrapper-valorant-pack-"))

try {
  const packOutput = execFileSync(
    "npm",
    ["pack", "--json", "--ignore-scripts", "--pack-destination", temporaryRoot],
    { cwd: projectRoot, encoding: "utf8" },
  )
  const [packResult] = JSON.parse(packOutput)
  if (packResult?.filename === undefined) {
    throw new Error("npm pack did not return a tarball filename")
  }

  const consumerRoot = join(temporaryRoot, "consumer")
  mkdirSync(consumerRoot)
  writeFileSync(join(consumerRoot, "package.json"), '{"private":true,"type":"module"}')
  execFileSync(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      join(temporaryRoot, packResult.filename),
    ],
    { cwd: consumerRoot, stdio: "inherit" },
  )

  writeFileSync(
    join(consumerRoot, "esm.mjs"),
    'import { ValorantApi } from "wrapper-valorant-api"; new ValorantApi({ apiKey: "test" });\n',
  )
  writeFileSync(
    join(consumerRoot, "commonjs.cjs"),
    'const { ValorantApi } = require("wrapper-valorant-api"); new ValorantApi({ apiKey: "test" });\n',
  )
  writeFileSync(
    join(consumerRoot, "consumer.ts"),
    'import { ValorantApi, type AccountDto } from "wrapper-valorant-api"; const api = new ValorantApi({ apiKey: "test" }); const result: Promise<AccountDto> = api.account.getByPuuid("puuid"); void result;\n',
  )

  execFileSync(process.execPath, [join(consumerRoot, "esm.mjs")], { stdio: "inherit" })
  execFileSync(process.execPath, [join(consumerRoot, "commonjs.cjs")], { stdio: "inherit" })
  const typescriptCli = resolve(projectRoot, "node_modules/typescript/bin/tsc")
  execFileSync(
    process.execPath,
    [
      typescriptCli,
      "--noEmit",
      "--strict",
      "--target",
      "ES2022",
      "--module",
      "NodeNext",
      "--moduleResolution",
      "NodeNext",
      join(consumerRoot, "consumer.ts"),
    ],
    { cwd: consumerRoot, stdio: "inherit" },
  )

  const installedManifest = JSON.parse(
    readFileSync(join(consumerRoot, "node_modules/wrapper-valorant-api/package.json"), "utf8"),
  )
  process.stdout.write(
    `Verified ${installedManifest.name}@${installedManifest.version} via ESM, CJS, and TypeScript.\n`,
  )
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true })
}
