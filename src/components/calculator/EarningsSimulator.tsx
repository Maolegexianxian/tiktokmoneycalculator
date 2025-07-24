"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  Target,
  Calendar,
  DollarSign,
  BarChart3,
  LineChart,
  Play,
  Pause,
  RotateCcw,
  Settings,
} from 'lucide-react';
import { CalculationResult } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface EarningsSimulatorProps {
  baseResults: CalculationResult;
  platform: string;
}

interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  followerGrowthRate: number; // monthly percentage
  engagementGrowthRate: number; // monthly percentage
  contentQualityMultiplier: number; // 0.5 - 2.0
  marketTrendMultiplier: number; // 0.8 - 1.5
}

interface SimulationResult {
  month: number;
  followers: number;
  avgViews: number;
  engagementRate: number;
  monthlyEarnings: number;
  cumulativeEarnings: number;
}

const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'conservative',
    name: 'Conservative Growth',
    description: 'Steady, realistic growth with consistent content',
    followerGrowthRate: 5,
    engagementGrowthRate: 2,
    contentQualityMultiplier: 1.0,
    marketTrendMultiplier: 1.0,
  },
  {
    id: 'optimistic',
    name: 'Optimistic Growth',
    description: 'Strong growth with viral content potential',
    followerGrowthRate: 15,
    engagementGrowthRate: 8,
    contentQualityMultiplier: 1.3,
    marketTrendMultiplier: 1.2,
  },
  {
    id: 'aggressive',
    name: 'Aggressive Growth',
    description: 'Maximum growth with trending content strategy',
    followerGrowthRate: 25,
    engagementGrowthRate: 15,
    contentQualityMultiplier: 1.5,
    marketTrendMultiplier: 1.4,
  },
  {
    id: 'custom',
    name: 'Custom Scenario',
    description: 'Define your own growth parameters',
    followerGrowthRate: 10,
    engagementGrowthRate: 5,
    contentQualityMultiplier: 1.1,
    marketTrendMultiplier: 1.1,
  },
];

export function EarningsSimulator({ baseResults, platform }: EarningsSimulatorProps) {
  const t = useTranslations('calculator.simulator');
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario>(SIMULATION_SCENARIOS[0] || {
    id: 'conservative',
    name: 'Conservative Growth',
    description: 'Steady, realistic growth',
    followerGrowthRate: 0.05,
    engagementGrowthRate: 0.02,
    contentQualityMultiplier: 1.0,
    marketTrendMultiplier: 1.0
  });
  const [simulationMonths, setSimulationMonths] = useState(12);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [customScenario, setCustomScenario] = useState<SimulationScenario>(SIMULATION_SCENARIOS[3] || {
    id: 'custom',
    name: 'Custom Scenario',
    description: 'Your custom growth scenario',
    followerGrowthRate: 0.1,
    engagementGrowthRate: 0.05,
    contentQualityMultiplier: 1.2,
    marketTrendMultiplier: 1.1
  });

  // Custom scenario controls
  const [showCustomControls, setShowCustomControls] = useState(false);

  useEffect(() => {
    if (selectedScenario.id === 'custom') {
      setShowCustomControls(true);
    } else {
      setShowCustomControls(false);
    }
  }, [selectedScenario]);

  const calculateEarnings = (
    followers: number,
    avgViews: number,
    engagementRate: number,
    scenario: SimulationScenario
  ): number => {
    const baseEarnings = baseResults.monthlyEarnings;
    const baseFollowers = 10000; // Default base followers
    const baseViews = 50000; // Default base views
    const baseEngagement = baseResults.factors.engagement.score;

    const followerMultiplier = followers / baseFollowers;
    const viewMultiplier = avgViews / baseViews;
    const engagementMultiplier = engagementRate / baseEngagement;
    
    return baseEarnings * 
           followerMultiplier * 
           viewMultiplier * 
           engagementMultiplier * 
           scenario.contentQualityMultiplier * 
           scenario.marketTrendMultiplier;
  };

  const runSimulation = () => {
    const scenario = selectedScenario.id === 'custom' ? customScenario : selectedScenario;
    const results: SimulationResult[] = [];

    let currentFollowers = 10000; // Default base followers
    let currentViews = 50000; // Default base views
    let currentEngagement = baseResults.factors.engagement.score;
    let cumulativeEarnings = 0;

    for (let month = 1; month <= simulationMonths; month++) {
      // Apply growth rates with some randomness
      const followerGrowth = scenario.followerGrowthRate * (0.8 + Math.random() * 0.4);
      const engagementGrowth = scenario.engagementGrowthRate * (0.8 + Math.random() * 0.4);
      
      currentFollowers *= (1 + followerGrowth / 100);
      currentViews *= (1 + followerGrowth / 100 * 0.8); // Views grow slower than followers
      currentEngagement *= (1 + engagementGrowth / 100);
      
      // Cap engagement rate at reasonable levels
      currentEngagement = Math.min(currentEngagement, 15);
      
      const monthlyEarnings = calculateEarnings(
        currentFollowers,
        currentViews,
        currentEngagement,
        scenario
      );
      
      cumulativeEarnings += monthlyEarnings;
      
      results.push({
        month,
        followers: Math.round(currentFollowers),
        avgViews: Math.round(currentViews),
        engagementRate: Number(currentEngagement.toFixed(2)),
        monthlyEarnings: Math.round(monthlyEarnings),
        cumulativeEarnings: Math.round(cumulativeEarnings),
      });
    }
    
    setSimulationResults(results);
  };

  const startAnimation = () => {
    setIsSimulating(true);
    setCurrentMonth(0);
    
    const interval = setInterval(() => {
      setCurrentMonth(prev => {
        if (prev >= simulationResults.length - 1) {
          setIsSimulating(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentMonth(0);
    setSimulationResults([]);
  };

  const currentResult = simulationResults[currentMonth] || simulationResults[simulationResults.length - 1];
  const finalResult = simulationResults[simulationResults.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-6 w-6" />
            {t('title')}
          </CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Simulation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('controls.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scenario Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('controls.scenario')}
              </label>
              <Select 
                value={selectedScenario.id} 
                onValueChange={(value) => {
                  const scenario = SIMULATION_SCENARIOS.find(s => s.id === value);
                  if (scenario) setSelectedScenario(scenario);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SIMULATION_SCENARIOS.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      <div>
                        <div className="font-medium">{scenario.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {scenario.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Simulation Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('controls.duration')}
              </label>
              <Select 
                value={simulationMonths.toString()} 
                onValueChange={(value) => setSimulationMonths(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 {t('controls.months')}</SelectItem>
                  <SelectItem value="12">12 {t('controls.months')}</SelectItem>
                  <SelectItem value="18">18 {t('controls.months')}</SelectItem>
                  <SelectItem value="24">24 {t('controls.months')}</SelectItem>
                  <SelectItem value="36">36 {t('controls.months')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom Scenario Controls */}
          {showCustomControls && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">{t('controls.customScenario')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('controls.followerGrowth')} (%/month)
                  </label>
                  <Input
                    type="number"
                    value={customScenario.followerGrowthRate}
                    onChange={(e) => setCustomScenario(prev => ({
                      ...prev,
                      followerGrowthRate: Number(e.target.value)
                    }))}
                    min="0"
                    max="50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('controls.engagementGrowth')} (%/month)
                  </label>
                  <Input
                    type="number"
                    value={customScenario.engagementGrowthRate}
                    onChange={(e) => setCustomScenario(prev => ({
                      ...prev,
                      engagementGrowthRate: Number(e.target.value)
                    }))}
                    min="0"
                    max="30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('controls.contentQuality')} (0.5-2.0)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={customScenario.contentQualityMultiplier}
                    onChange={(e) => setCustomScenario(prev => ({
                      ...prev,
                      contentQualityMultiplier: Number(e.target.value)
                    }))}
                    min="0.5"
                    max="2.0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('controls.marketTrend')} (0.8-1.5)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={customScenario.marketTrendMultiplier}
                    onChange={(e) => setCustomScenario(prev => ({
                      ...prev,
                      marketTrendMultiplier: Number(e.target.value)
                    }))}
                    min="0.8"
                    max="1.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={runSimulation} disabled={isSimulating}>
              <BarChart3 className="h-4 w-4 mr-2" />
              {t('controls.runSimulation')}
            </Button>
            {simulationResults.length > 0 && (
              <>
                <Button 
                  variant="outline" 
                  onClick={startAnimation} 
                  disabled={isSimulating}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {t('controls.animate')}
                </Button>
                <Button variant="outline" onClick={resetSimulation}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t('controls.reset')}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Simulation Results */}
      {simulationResults.length > 0 && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t('results.overview')}</TabsTrigger>
            <TabsTrigger value="timeline">{t('results.timeline')}</TabsTrigger>
            <TabsTrigger value="projections">{t('results.projections')}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Current State Display */}
            {isSimulating && currentResult && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {t('results.currentMonth', { month: currentResult.month })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {formatNumber(currentResult.followers)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('results.followers')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {currentResult.engagementRate}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('results.engagement')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(currentResult.monthlyEarnings)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('results.monthlyEarnings')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {formatCurrency(currentResult.cumulativeEarnings)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('results.totalEarnings')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Final Results Summary */}
            {finalResult && !isSimulating && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('results.finalFollowers')}
                        </p>
                        <p className="text-2xl font-bold">
                          {formatNumber(finalResult.followers)}
                        </p>
                        <p className="text-xs text-green-600">
                          +{Math.round(((finalResult.followers - 10000) / 10000) * 100)}%
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('results.finalEngagement')}
                        </p>
                        <p className="text-2xl font-bold">
                          {finalResult.engagementRate}%
                        </p>
                        <p className="text-xs text-green-600">
                          +{(finalResult.engagementRate - baseResults.factors.engagement.score).toFixed(2)}%
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('results.finalMonthlyEarnings')}
                        </p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(finalResult.monthlyEarnings)}
                        </p>
                        <p className="text-xs text-green-600">
                          +{Math.round(((finalResult.monthlyEarnings - baseResults.monthlyEarnings) / baseResults.monthlyEarnings) * 100)}%
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('results.totalEarnings')}
                        </p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(finalResult.cumulativeEarnings)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {simulationMonths} {t('controls.months')}
                        </p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('results.monthlyBreakdown')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">{t('results.month')}</th>
                        <th className="text-right p-2">{t('results.followers')}</th>
                        <th className="text-right p-2">{t('results.engagement')}</th>
                        <th className="text-right p-2">{t('results.monthlyEarnings')}</th>
                        <th className="text-right p-2">{t('results.cumulativeEarnings')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulationResults.map((result, index) => (
                        <tr 
                          key={result.month} 
                          className={`border-b ${
                            isSimulating && index === currentMonth ? 'bg-blue-50' : ''
                          }`}
                        >
                          <td className="p-2 font-medium">
                            {t('results.monthLabel', { month: result.month })}
                          </td>
                          <td className="text-right p-2">
                            {formatNumber(result.followers)}
                          </td>
                          <td className="text-right p-2">
                            {result.engagementRate}%
                          </td>
                          <td className="text-right p-2 font-semibold">
                            {formatCurrency(result.monthlyEarnings)}
                          </td>
                          <td className="text-right p-2 font-bold">
                            {formatCurrency(result.cumulativeEarnings)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projections Tab */}
          <TabsContent value="projections" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Growth Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('results.milestones')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {finalResult && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t('results.milestone10k')}</span>
                        <Badge variant={finalResult.followers >= 10000 ? 'default' : 'secondary'}>
                          {finalResult.followers >= 10000 ? t('results.achieved') : t('results.pending')}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t('results.milestone100k')}</span>
                        <Badge variant={finalResult.followers >= 100000 ? 'default' : 'secondary'}>
                          {finalResult.followers >= 100000 ? t('results.achieved') : t('results.pending')}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t('results.milestone1m')}</span>
                        <Badge variant={finalResult.followers >= 1000000 ? 'default' : 'secondary'}>
                          {finalResult.followers >= 1000000 ? t('results.achieved') : t('results.pending')}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t('results.milestone10kEarnings')}</span>
                        <Badge variant={finalResult.monthlyEarnings >= 10000 ? 'default' : 'secondary'}>
                          {finalResult.monthlyEarnings >= 10000 ? t('results.achieved') : t('results.pending')}
                        </Badge>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Scenario Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('results.scenarioComparison')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm font-medium">{t('results.selectedScenario')}</div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium">{selectedScenario.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedScenario.description}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="font-medium">{t('results.followerGrowth')}:</span>
                          <span className="ml-1">{selectedScenario.followerGrowthRate}%/month</span>
                        </div>
                        <div>
                          <span className="font-medium">{t('results.engagementGrowth')}:</span>
                          <span className="ml-1">{selectedScenario.engagementGrowthRate}%/month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}