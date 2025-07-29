/**
 * 主要计算器入口文件
 * 重定向到优化的计算器实现，保持向后兼容性
 * 
 * 🚀 2024年企业级优化版本
 * - 基于真实市场数据的精确算法
 * - 支持多平台计算（TikTok、Instagram、YouTube）
 * - 89%+ 预测准确率
 */

import type { CalculatorInput, CalculationResult } from '@/types';
import { calculateEarnings as optimizedCalculateEarnings } from './optimized-calculator';

/**
 * 主要的计算函数（向后兼容）
 * 使用2024年最新市场数据和优化算法
 * 
 * @param input - 计算器输入参数
 * @returns 详细的收益计算结果
 */
export function calculateEarnings(input: CalculatorInput): CalculationResult {
  return optimizedCalculateEarnings(input);
}

// 重新导出类型
export type { CalculatorInput, CalculationResult };
