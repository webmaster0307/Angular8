import * as _Modeler from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import _PropertiesPanelModule from 'bpmn-js-properties-panel';
import _BpmnPropertiesProvider from 'bpmn-js-properties-panel/lib/provider/bpmn';
import _EntryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import _PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';

import * as _MagicModdleDescriptor from 'bpmn-js-properties-panel/lib/descriptors/magic.json'

export const InjectionNames = {
  eventBus: 'eventBus',
  bpmnFactory: 'bpmnFactory',
  elementRegistry: 'elementRegistry',
  translate: 'translate',
  propertiesProvider: 'propertiesProvider',
  bpmnPropertiesProvider: 'bpmnPropertiesProvider',
  paletteProvider: 'paletteProvider',
  originalPaletteProvider: 'originalPaletteProvider',
};

export const Modeler = _Modeler;
export const PropertiesPanelModule = _PropertiesPanelModule;
export const EntryFactory = _EntryFactory;
export const OriginalPaletteProvider = _PaletteProvider;
export const OriginalPropertiesProvider = _BpmnPropertiesProvider;
export const MagicModdleDescriptor = _MagicModdleDescriptor;
export interface IPaletteProvider {
  getPaletteEntries(): any;
}

export interface IPalette {
  registerProvider(provider: IPaletteProvider): any;
}

export interface IPropertiesProvider {
  getTabs(elemnt): any;
}
