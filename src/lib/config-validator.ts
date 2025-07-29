/**
 * 企业级配置验证系统
 * 确保所有配置数据的完整性和有效性
 */

import { ENHANCED_EARNINGS_CONFIG, ML_MODEL_CONFIG } from './enterprise-config';

// 验证结果接口
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    warningChecks: number;
  };
}

// 配置验证器类
export class ConfigValidator {
  private static instance: ConfigValidator;
  
  static getInstance(): ConfigValidator {
    if (!ConfigValidator.instance) {
      ConfigValidator.instance = new ConfigValidator();
    }
    return ConfigValidator.instance;
  }

  /**
   * 验证所有企业级配置
   */
  validateAllConfigs(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let totalChecks = 0;
    let passedChecks = 0;

    // 验证平台费率配置
    const platformResult = this.validatePlatformRates();
    totalChecks += platformResult.summary.totalChecks;
    passedChecks += platformResult.summary.passedChecks;
    errors.push(...platformResult.errors);
    warnings.push(...platformResult.warnings);

    // 验证细分领域配置
    const nicheResult = this.validateNicheConfig();
    totalChecks += nicheResult.summary.totalChecks;
    passedChecks += nicheResult.summary.passedChecks;
    errors.push(...nicheResult.errors);
    warnings.push(...nicheResult.warnings);

    // 验证地理位置配置
    const locationResult = this.validateLocationConfig();
    totalChecks += locationResult.summary.totalChecks;
    passedChecks += locationResult.summary.passedChecks;
    errors.push(...locationResult.errors);
    warnings.push(...locationResult.warnings);

    // 验证ML模型配置
    const mlResult = this.validateMLConfig();
    totalChecks += mlResult.summary.totalChecks;
    passedChecks += mlResult.summary.passedChecks;
    errors.push(...mlResult.errors);
    warnings.push(...mlResult.warnings);

    const failedChecks = totalChecks - passedChecks;
    const warningChecks = warnings.length;

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      summary: {
        totalChecks,
        passedChecks,
        failedChecks,
        warningChecks,
      },
    };
  }

  /**
   * 验证平台费率配置
   */
  private validatePlatformRates(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let totalChecks = 0;
    let passedChecks = 0;

    const platforms = ['tiktok', 'instagram', 'youtube'];
    
    for (const platform of platforms) {
      const config = ENHANCED_EARNINGS_CONFIG.PLATFORM_BASE_RATES[platform as keyof typeof ENHANCED_EARNINGS_CONFIG.PLATFORM_BASE_RATES];
      
      if (!config) {
        errors.push(`Missing configuration for platform: ${platform}`);
        totalChecks++;
        continue;
      }

      // 验证CPM费率
      totalChecks++;
      if (platform === 'tiktok' && config.creatorFundCPM) {
        if (this.isValidCPMRange(config.creatorFundCPM)) {
          passedChecks++;
        } else {
          errors.push(`Invalid CPM range for ${platform}`);
        }
      } else if (platform === 'instagram' && config.creatorFundCPM) {
        if (this.isValidCPMRange(config.creatorFundCPM)) {
          passedChecks++;
        } else {
          errors.push(`Invalid CPM range for ${platform}`);
        }
      } else if (platform === 'youtube' && config.adRevenueCPM) {
        if (this.isValidCPMRange(config.adRevenueCPM)) {
          passedChecks++;
        } else {
          errors.push(`Invalid CPM range for ${platform}`);
        }
      } else {
        passedChecks++;
      }

      // 验证品牌合作费率
      totalChecks++;
      if (config.brandDealRates && this.isValidBrandDealRates(config.brandDealRates)) {
        passedChecks++;
      } else {
        errors.push(`Invalid brand deal rates for ${platform}`);
      }

      // 验证联盟营销费率
      if (config.affiliateRates) {
        totalChecks++;
        if (this.isValidAffiliateRates(config.affiliateRates)) {
          passedChecks++;
        } else {
          warnings.push(`Questionable affiliate rates for ${platform}`);
          passedChecks++;
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      summary: { totalChecks, passedChecks, failedChecks: totalChecks - passedChecks, warningChecks: warnings.length },
    };
  }

  /**
   * 验证细分领域配置
   */
  private validateNicheConfig(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let totalChecks = 0;
    let passedChecks = 0;

    const niches = Object.keys(ENHANCED_EARNINGS_CONFIG.ENHANCED_NICHE_CONFIG);
    
    for (const niche of niches) {
      const config = ENHANCED_EARNINGS_CONFIG.ENHANCED_NICHE_CONFIG[niche as keyof typeof ENHANCED_EARNINGS_CONFIG.ENHANCED_NICHE_CONFIG];
      
      // 验证倍数范围
      totalChecks++;
      if (config.multiplier >= 0.5 && config.multiplier <= 3.0) {
        passedChecks++;
      } else {
        errors.push(`Invalid multiplier for niche ${niche}: ${config.multiplier}`);
      }

      // 验证品牌亲和度评分
      totalChecks++;
      if (config.brandAffinityScore >= 0 && config.brandAffinityScore <= 1) {
        passedChecks++;
      } else {
        errors.push(`Invalid brand affinity score for niche ${niche}: ${config.brandAffinityScore}`);
      }

      // 验证受众价值评分
      totalChecks++;
      if (config.audienceValueScore >= 0 && config.audienceValueScore <= 1) {
        passedChecks++;
      } else {
        errors.push(`Invalid audience value score for niche ${niche}: ${config.audienceValueScore}`);
      }

      // 验证竞争水平
      totalChecks++;
      if (config.competitionLevel >= 0 && config.competitionLevel <= 1) {
        passedChecks++;
      } else {
        warnings.push(`Unusual competition level for niche ${niche}: ${config.competitionLevel}`);
        passedChecks++;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      summary: { totalChecks, passedChecks, failedChecks: totalChecks - passedChecks, warningChecks: warnings.length },
    };
  }

  /**
   * 验证地理位置配置
   */
  private validateLocationConfig(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let totalChecks = 0;
    let passedChecks = 0;

    const locations = Object.keys(ENHANCED_EARNINGS_CONFIG.ENHANCED_LOCATION_CONFIG);
    
    for (const location of locations) {
      const config = ENHANCED_EARNINGS_CONFIG.ENHANCED_LOCATION_CONFIG[location as keyof typeof ENHANCED_EARNINGS_CONFIG.ENHANCED_LOCATION_CONFIG];
      
      // 验证倍数范围
      totalChecks++;
      if (config.multiplier >= 0.1 && config.multiplier <= 2.0) {
        passedChecks++;
      } else {
        errors.push(`Invalid multiplier for location ${location}: ${config.multiplier}`);
      }

      // 验证购买力指数
      totalChecks++;
      if (config.purchasingPower >= 0 && config.purchasingPower <= 2.0) {
        passedChecks++;
      } else {
        errors.push(`Invalid purchasing power for location ${location}: ${config.purchasingPower}`);
      }

      // 验证社交媒体渗透率
      totalChecks++;
      if (config.socialMediaPenetration >= 0 && config.socialMediaPenetration <= 1) {
        passedChecks++;
      } else {
        warnings.push(`Unusual social media penetration for location ${location}: ${config.socialMediaPenetration}`);
        passedChecks++;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      summary: { totalChecks, passedChecks, failedChecks: totalChecks - passedChecks, warningChecks: warnings.length },
    };
  }

  /**
   * 验证ML模型配置
   */
  private validateMLConfig(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let totalChecks = 0;
    let passedChecks = 0;

    // 验证特征权重总和
    totalChecks++;
    const weightSum = Object.values(ML_MODEL_CONFIG.FEATURE_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
    if (Math.abs(weightSum - 1.0) < 0.01) {
      passedChecks++;
    } else {
      errors.push(`Feature weights do not sum to 1.0: ${weightSum}`);
    }

    // 验证模型参数
    totalChecks++;
    if (ML_MODEL_CONFIG.MODEL_PARAMS.nEstimators > 0 && ML_MODEL_CONFIG.MODEL_PARAMS.maxDepth > 0) {
      passedChecks++;
    } else {
      errors.push('Invalid model parameters');
    }

    // 验证预测阈值
    totalChecks++;
    if (ML_MODEL_CONFIG.PREDICTION_THRESHOLDS.minConfidence >= 0 && 
        ML_MODEL_CONFIG.PREDICTION_THRESHOLDS.minConfidence <= 1) {
      passedChecks++;
    } else {
      errors.push('Invalid confidence threshold');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      summary: { totalChecks, passedChecks, failedChecks: totalChecks - passedChecks, warningChecks: warnings.length },
    };
  }

  /**
   * 辅助验证方法
   */
  private isValidCPMRange(cpmConfig: any): boolean {
    return cpmConfig && 
           typeof cpmConfig.average === 'number' && 
           cpmConfig.average > 0 && 
           cpmConfig.average < 1;
  }

  private isValidBrandDealRates(rates: any): boolean {
    const tiers = ['nano', 'micro', 'mid', 'macro', 'mega'];
    return tiers.every(tier => 
      rates[tier] && 
      typeof rates[tier].average === 'number' && 
      rates[tier].average > 0
    );
  }

  private isValidAffiliateRates(rates: any): boolean {
    return Object.values(rates).every((rate: any) => 
      typeof rate === 'number' && rate >= 0 && rate <= 0.1
    );
  }
}

// 导出单例实例
export const configValidator = ConfigValidator.getInstance();

// 启动时验证配置
export function validateConfigOnStartup(): void {
  console.log('🔍 Validating enterprise configuration...');
  
  const result = configValidator.validateAllConfigs();
  
  if (result.isValid) {
    console.log('✅ Configuration validation passed');
    console.log(`📊 Summary: ${result.summary.passedChecks}/${result.summary.totalChecks} checks passed`);
    
    if (result.warnings.length > 0) {
      console.warn('⚠️ Configuration warnings:');
      result.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
  } else {
    console.error('❌ Configuration validation failed');
    console.error('🚨 Errors:');
    result.errors.forEach(error => console.error(`  - ${error}`));
    
    if (result.warnings.length > 0) {
      console.warn('⚠️ Warnings:');
      result.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
    
    // 在生产环境中，可能需要阻止应用启动
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Configuration validation failed in production environment');
    }
  }
}
