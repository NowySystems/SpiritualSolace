declare module "@opennextjs/cloudflare" {
  export type CloudflareConfig = Record<string, unknown>;

  export function defineCloudflareConfig(
    config?: CloudflareConfig
  ): CloudflareConfig;
}
