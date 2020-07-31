import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, ComponentFactory, ApplicationRef, Injector, EmbeddedViewRef } from '@angular/core';
import { ComunicationService } from 'src/services/comunication.service';
import { DeviceComponent } from '../ui.components/device.component/device.component';
import { TimerService } from 'src/services/timer.service';
import { Crypter } from 'src/services/crypter.service';
import { isUndefined, isNullOrUndefined, isNull } from 'util';
import { ERROR } from 'src/models/error';
import { DevicesService } from 'src/services/devices.service';
import { indexedDB } from 'src/services/indexedDB.service';
import { Workspace } from 'src/models/workspace';
import { Dispositivo } from '../../../models/workspace';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {

  ERROR = new ERROR();
  @ViewChild("Container", { read: ViewContainerRef }) container;
  componentRef: ComponentRef<DeviceComponent>;
  
  constructor( private COMUNICATION_SERVICE: ComunicationService, private RESOLVER: ComponentFactoryResolver, private appRef: ApplicationRef, private DEVICES_SERVICE: DevicesService, private INDEXdb: indexedDB) {
    console.log("called constructor")

  }

    async ngAfterViewInit() {
      this.COMUNICATION_SERVICE.workspace_updated.suscribe( () => {
        this.createElements();
      })
      
      if(!isNullOrUndefined(await this.INDEXdb.existsWorkSpace())){ //if workSpace exits
        this.createElements()
      }  
  }

  createElements = async () => {

    const ComponentFactory = this.RESOLVER.resolveComponentFactory(DeviceComponent);
    const workSpace = new Workspace(JSON.parse(Crypter.DECRYPT(await this.INDEXdb.getWorkspace())));
    console.log(workSpace)
    //console.log(JSON.parse(Crypter.DECRYPT(workSpace)));

   workSpace.Drivers.forEach( d => {

      this.container.createComponent(ComponentFactory);

      //this.appRef.attachView(componentRef.hostView); //attach to angular component tree
    });



  }

  ERROR_CALLBACK = (error) => {
    console.log(error)
    this.ERROR.OCURRED = true;
    this.ERROR.MESSAGE = "Fallo al contactar al servicio SCADA"
    this.ERROR.TYPE = "DANGER";
}

FINISHED_CALLBACK = () => {
    //this.PERFORMING_TRANSACTION = false;
    //this.CHANGE_DETECTOR.detectChanges()
}

}
/*  */

/* @Component({
  selector: 'my-app',
  template: `
    <template #alertContainer></template>
    <button (click)="createComponent('success')">Create success alert</button>
    <button (click)="createComponent('danger')">Create danger alert</button>
  `,
})
export class App {
 @ViewChild("alertContainer", { read: ViewContainerRef }) container;
 componentRef: ComponentRef;
 
  constructor(private resolver: ComponentFactoryResolver) {}
  
  createComponent(type) {
    this.container.clear();
    const factory: ComponentFactory = this.resolver.resolveComponentFactory(AlertComponent);

    this.componentRef = this.container.createComponent(factory);
    
    this.componentRef.instance.type = type;

    this.componentRef.instance.output.subscribe(event => console.log(event));

  }
  
    ngOnDestroy() {
      this.componentRef.destroy();    
    } */
