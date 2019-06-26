import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Modeler, PropertiesPanelModule, InjectionNames, OriginalPropertiesProvider, OriginalPaletteProvider } from './bpmn-js';
import { CustomPropsProvider } from './props-provider/custom-props-provider';
import { CustomPaletteProvider } from './props-provider/custom-palette-provider';
import { Globals } from 'src/app/services/globals';

@Component({
  selector: 'app-process-design',
  templateUrl: './process-design.component.html',
  styleUrls: ['./process-design.component.scss']
})
export class ProcessDesignComponent implements OnInit, OnDestroy {

  private modeler: any;
  private url: string;
  private user: any;

  constructor(
    private httpClient: HttpClient,
    private globals: Globals
  ) { }

  ngOnInit() {
    this.url = `https://${this.globals.domain_name + this.globals.Path + this.globals.version}/securedJSON`;
    this.user = JSON.parse(sessionStorage.getItem('u'));
    this.modeler = new Modeler({
      container: '#canvas',
      width: '100%',
      height: '600px',
      additionalModules: [
        PropertiesPanelModule,
        { [InjectionNames.bpmnPropertiesProvider]: ['type', OriginalPropertiesProvider.propertiesProvider[1]] },
        { [InjectionNames.propertiesProvider]: ['type', CustomPropsProvider] },
        { [InjectionNames.originalPaletteProvider]: ['type', OriginalPaletteProvider] },
        { [InjectionNames.paletteProvider]: ['type', CustomPaletteProvider] },
      ],
      propertiesPanel: {
        parent: '#properties'
      },
      moddleExtension: {
        custom: {
          name: 'customModdle',
          prefix: 'custom',
          xml: {
            tagAlias: 'lowerCase'
          },
          associations: [],
          types: [
            {
              'name': 'ExtUserTask',
              'extends': [
                'bpmn:UserTask'
              ],
              'properties': [
                {
                  'name': 'worklist',
                  'isAttr': true,
                  'type': 'String'
                }
              ]
            },
          ]
        }
      }
    });
    this.httpClient.get('/assets/bpmn/newDiagram.bpmn', {
      headers: { observe: 'response' }, responseType: 'text'
    }).subscribe(
      (x: any) => {
        this.modeler.importXML(x, this.handleError);
        const eventBus = this.modeler.get('eventBus');
        if (eventBus) {
          eventBus.on('element.changed', ($event) => {
            if ($event && $event.element && ['bpmn:Process', 'label'].indexOf($event.element.type) === -1) {
              if ($event.element.type === 'bpmn:SequenceFlow') {
                const data: any = {
                  REST_Service: 'Orchetration',
                  RESULT: '@RESULT',
                  V_APP_CD: 'Marketing',
                  V_CONT_ON_ERR_FLG: 'N',
                  V_PRCS_CD: '',
                  V_PRDCR_APP_CD: 'Marketing',
                  V_PRDCR_PRCS_CD: 'Email DHS POC',
                  V_PRDCR_SRC_CD: this.user.SRC_CD,
                  V_PRDCR_SRVC_CD: $event.element.businessObject.sourceRef.id,
                  V_SRC_CD: this.user.SRC_CD,
                  V_SRVC_CD: $event.element.businessObject.targetRef.id,
                  V_USR_NM: this.user.USR_NM,
                  Verb: 'PUT'
                };
                this.httpClient.put(this.url, data).subscribe();
              } else {
                const data: any = {
                  REST_Service: 'Service',
                  V_APP_CD: 'Marketing',
                  V_CREATE: 'Y',
                  V_DELETE: 'Y',
                  V_EXECUTE: 'Y',
                  V_PRCS_CD: 'Email DHS POC',
                  V_READ: 'Y',
                  V_ROLE_CD: 'Program Assessment Role',
                  V_SRC_CD: this.user.SRC_CD,
                  V_SRVC_CD: $event.element.businessObject.name,
                  V_SRVC_DSC: '',
                  V_UPDATE: 'Y',
                  V_USR_NM: this.user.USR_NM,
                  Verb: 'PUT'
                };
                this.httpClient.post(this.url, data).subscribe();
              }
            }
          });
        }
      },
      this.handleError
    );
  }

  ngOnDestroy() {
    if (this.modeler) {
      this.modeler.destroy();
    }
  }

  handleError(err: any) {
    if (err) {
      console.error(err);
    }
  }

}
