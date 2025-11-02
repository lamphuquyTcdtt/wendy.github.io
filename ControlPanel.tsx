import React, { useState } from 'react';
import { Filter, FashionItem, AdjustmentSettings, DetectedItem, HairStyle, MakeupLook, StyleLook, BackgroundTheme, BodyShapeStyle, FaceRetouchSettings, JapaneseTextStyle, AppliedFashionItem, Color } from '../types';
import FilterControls from './FilterControls';
import FashionControls from './FashionControls';
import AdjustmentControls from './AdjustmentControls';
import HairAndMakeupControls from './HairAndMakeupControls';
import StylistControls from './StylistControls';
import BackgroundControls from './BackgroundControls';
import JapaneseTextControls from './JapaneseTextControls';
import ExtractClothingControls from './ExtractClothingControls';
import BackgroundRemovalControls from './BackgroundRemovalControls';
import ModelGeneratorControls from './ModelGeneratorControls';
import PerspectiveGeneratorControls from './PerspectiveGeneratorControls';
import { useTranslation } from '../hooks/useTranslation';

interface ControlPanelProps {
  onApplyFilter: (filter: Filter) => void;
  onApplyFashionItem: (item: FashionItem, color: Color) => void;
  onApplyAdjustments: (settings: AdjustmentSettings) => void;
  onReset: () => void;
  onResetFashion: () => void;
  appliedFashionItems: AppliedFashionItem[];
  isDisabled: boolean;
  detectedClothing: DetectedItem[] | null;
  isDetecting: boolean;
  onApplyHairStyle: (style: HairStyle) => void;
  onApplyMakeupLook: (look: MakeupLook) => void;
  appliedHairStyle: HairStyle | null;
  appliedMakeupLook: MakeupLook | null;
  onResetHairAndMakeup: () => void;
  onApplyStyle: (style: StyleLook) => void;
  appliedStyle: StyleLook | null;
  onResetStylist: () => void;
  onApplyBackground: (theme: BackgroundTheme) => void;
  appliedBackground: BackgroundTheme | null;
  onResetBackground: () => void;
  onApplyBodyShapeStyle: (style: BodyShapeStyle) => void;
  appliedBodyShapeStyle: BodyShapeStyle | null;
  onApplyFaceRetouch: (settings: FaceRetouchSettings) => void;
  appliedFaceRetouch: FaceRetouchSettings | null;
  onApplyJapaneseTextStyle: (style: JapaneseTextStyle) => void;
  appliedJapaneseTextStyle: JapaneseTextStyle | null;
  onResetJapaneseText: () => void;
  onFilterHoverStart?: (filter: Filter) => void;
  onFilterHoverEnd?: () => void;
  onExtractClothing: (image: File, selection: { x: number; y: number; width: number; height: number; }) => void;
  onAutoExtractClothing: (image: File, clothingType: string) => void;
  customFashionItems: FashionItem[];
  onRemoveBackground: () => void;
  onGenerateModelImage: (modelImg: File, clothingImg: File, backgroundImg: File, prompt: string, aspectRatio: string) => void;
  onGeneratePerspectiveImage: (clothingImg: File, prompt: string, aspectRatio: string, count: number) => void;
}

type TabKey = 'tabFilters' | 'tabVirtualTryOn' | 'tabExtractClothing' | 'tabModelGenerator' | 'tabPerspectiveGenerator' | 'tabStylist' | 'tabHairAndMakeup' | 'tabBackground' | 'tabBackgroundRemoval' | 'tabAdjust' | 'tabJapaneseText';

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('tabFilters');

  const TABS: { key: TabKey }[] = [
      { key: 'tabFilters' },
      { key: 'tabVirtualTryOn' },
      { key: 'tabExtractClothing' },
      { key: 'tabModelGenerator' },
      { key: 'tabPerspectiveGenerator' },
      { key: 'tabStylist' },
      { key: 'tabHairAndMakeup' },
      { key: 'tabBackground' },
      { key: 'tabBackgroundRemoval' },
      { key: 'tabJapaneseText' },
      { key: 'tabAdjust' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tabFilters':
        return <FilterControls onSelectFilter={props.onApplyFilter} isDisabled={props.isDisabled} onFilterHoverStart={props.onFilterHoverStart} onFilterHoverEnd={props.onFilterHoverEnd} />;
      case 'tabVirtualTryOn':
        return (
          <FashionControls
            onSelectItem={props.onApplyFashionItem}
            appliedItems={props.appliedFashionItems}
            onResetFashion={props.onResetFashion}
            isDisabled={props.isDisabled}
            detectedClothing={props.detectedClothing}
            isDetecting={props.isDetecting}
            customFashionItems={props.customFashionItems}
          />
        );
      case 'tabExtractClothing':
        return <ExtractClothingControls onManualExtract={props.onExtractClothing} onAutoExtract={props.onAutoExtractClothing} isDisabled={props.isDisabled} />;
      case 'tabModelGenerator':
        return <ModelGeneratorControls onGenerate={props.onGenerateModelImage} isDisabled={props.isDisabled} />;
      case 'tabPerspectiveGenerator':
        return <PerspectiveGeneratorControls onGenerate={props.onGeneratePerspectiveImage} isDisabled={props.isDisabled} />;
      case 'tabStylist':
        return (
          <StylistControls
            onApplyStyle={props.onApplyStyle}
            appliedStyle={props.appliedStyle}
            onResetStylist={props.onResetStylist}
            isDisabled={props.isDisabled}
            onApplyBodyShapeStyle={props.onApplyBodyShapeStyle}
            appliedBodyShapeStyle={props.appliedBodyShapeStyle}
          />
        );
      case 'tabHairAndMakeup':
        return (
          <HairAndMakeupControls
            onApplyHairStyle={props.onApplyHairStyle}
            onApplyMakeupLook={props.onApplyMakeupLook}
            appliedHairStyle={props.appliedHairStyle}
            appliedMakeupLook={props.appliedMakeupLook}
            onResetHairAndMakeup={props.onResetHairAndMakeup}
            isDisabled={props.isDisabled}
            onApplyFaceRetouch={props.onApplyFaceRetouch}
            appliedFaceRetouch={props.appliedFaceRetouch}
          />
        );
      case 'tabBackground':
        return (
          <BackgroundControls
            onApplyBackground={props.onApplyBackground}
            appliedBackground={props.appliedBackground}
            onResetBackground={props.onResetBackground}
            isDisabled={props.isDisabled}
          />
        );
      case 'tabBackgroundRemoval':
        return <BackgroundRemovalControls onRemoveBackground={props.onRemoveBackground} isDisabled={props.isDisabled} />;
      case 'tabJapaneseText':
        return (
          <JapaneseTextControls
            onApplyTextStyle={props.onApplyJapaneseTextStyle}
            appliedTextStyle={props.appliedJapaneseTextStyle}
            onResetTextStyle={props.onResetJapaneseText}
            isDisabled={props.isDisabled}
          />
        );
      case 'tabAdjust':
        return <AdjustmentControls onApply={props.onApplyAdjustments} isDisabled={props.isDisabled} />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tabKey: TabKey }> = ({ tabKey }) => (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-violet-500 ${
        activeTab === tabKey
          ? 'bg-violet-600 text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {t(tabKey)}
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg space-y-6 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t('editingTools')}</h2>
        <button
            onClick={props.onReset}
            disabled={props.isDisabled}
            className="text-sm font-medium text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            {t('resetImage')}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
        {TABS.map(tab => <TabButton key={tab.key} tabKey={tab.key} />)}
      </div>

      <div className="overflow-y-auto" style={{maxHeight: 'calc(100vh - 300px)'}}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ControlPanel;
