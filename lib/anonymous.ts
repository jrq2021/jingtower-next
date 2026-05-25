/**
 * 匿名用户 ID 工具
 *
 * 在不做登录系统的前提下，用 localStorage 持久化一个 anonymousId，
 * 用于关联 reading、order、unlock 等数据。
 *
 * 文案中不出现"游客 ID"，仅作为技术字段使用。
 */

const ANON_KEY = "jingtower_anonymous_id";

/**
 * 获取或创建 anonymousId。
 * 首次访问时自动生成，后续访问从 localStorage 读取。
 */
export function getAnonymousId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(ANON_KEY);
    if (!id) {
      id = `anon-${crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`}`;
      window.localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}
