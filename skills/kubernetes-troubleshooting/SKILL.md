---
name: kubernetes-troubleshooting
description: 定位 Pod 无法启动、频繁重启、服务不可达等问题。当集群工作负载异常时使用。
category: operations
---

# 容器编排排障

定位 Pod 无法启动、频繁重启、服务不可达等问题。当集群工作负载异常时使用。

## 何时使用

- Pod CrashLoopBackOff
- 服务 5xx 或超时

## 步骤

1. 看事件与 describe 输出定位调度/镜像/挂载问题
2. 看容器日志与上次崩溃日志
3. 检查资源限制与探针配置
4. 检查网络策略、Service、Ingress 链路

## 规则

- 先区分调度失败、启动失败、运行中失败
- 探针失败不等于进程挂了
- 变更前后对比配置

## 红线

- 不直接删除 Pod 期待自愈
- 不在未看日志前猜测原因
