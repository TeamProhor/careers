import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactCompiler: true,
  allowedDevOrigins: ["79.143.185.101"],
};

const withMDX = createMDX();

export default withMDX(nextConfig);
