import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Machine } from './machine.model';
import { ThisReceiver } from '@angular/compiler';

@Injectable({ providedIn: 'root' })
export class MachineService {
  private machines: any = [];
  private roles: any = [];
  private machinekeyvals: any = [];
  private collections: any = [];
  public collectionchoosed: any;
  private machinesUpdated = new Subject<any[]>();
  private machineKeyvalsUpdated = new Subject<any[]>();
  private collectionsUpdated = new Subject<any[]>();
  private rolesUpdated = new Subject<any[]>();
  dynamicColumns: any = [];
  dynamicKeyVal: any = [];
  private editId;
  config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  constructor(private http: HttpClient, public router: Router) {}

  public getDataMachines() {
    return this.http
      .get('http://localhost:3000/api/machines')
      .subscribe((machineData) => {
        this.machines = machineData;
        this.machinesUpdated.next([...this.machines]);
      });
  }

  getMachineKeyVals() {
    this.http
      .get<{ message: string; machines: any }>(
        'http://localhost:3000/api/machines/machinekeyvalues'
      )
      .pipe(
        map((machineData) => {
          //console.log(machineData.message);
          // console.log(machineData.machines);
          //console.log('Get Machines KeyValues Called');
          return machineData.machines;
        })
      )
      .subscribe((machineData) => {
        this.machinekeyvals = machineData;
        this.machineKeyvalsUpdated.next([...this.machinekeyvals]);
      });
  }

  getRoles() {
    this.http
      .get<{ message: string; roles: any }>(
        'http://localhost:3000/api/users/getroles'
      )
      .pipe(
        map((roleData) => {
          //console.log(machineData.message);
          // console.log(machineData.machines);
          //console.log('Get Machines KeyValues Called');
          // console.log('Got Roles', roleData.roles);
          // console.log(roleData.message);
          return roleData.roles;
        })
      )
      .subscribe((roleData) => {
        this.roles = roleData;
        this.rolesUpdated.next([...this.roles]);
      });
  }

  getCollections() {
    this.http
      .get<{ message: string; machines: any }>(
        'http://localhost:3000/api/machines/collections'
      )
      .pipe(
        map((collection) => {
          // console.log('Get Collection Called');
          // console.log(collection);
          return collection;
        })
      )
      .subscribe((collection) => {
        this.collections = collection;
        this.collectionsUpdated.next([...this.collections]);
      });
  }

  getMachines() {
    this.http
      .get<{ message: string; machines: any }>(
        'http://localhost:3000/api/machines'
      )
      .pipe(
        map((machineData) => {
          // console.log(machineData.message);
          // console.log('Get Machines Called');
          return machineData.machines;
        })
      )
      .subscribe((machineData) => {
        this.machines = machineData;
        this.machinesUpdated.next([...this.machines]);
      });
  }

  getMachineUpdateListener() {
    return this.machinesUpdated.asObservable();
  }

  getRoleUpdateListener() {
    return this.rolesUpdated.asObservable();
  }
  getMachineKeyValUpdateListener() {
    return this.machineKeyvalsUpdated.asObservable();
  }

  getchoosedcollection(val) {
    this.collectionchoosed = val;

    // this.passusercollection();
  }
  getCollectionUpdateListener() {
    return this.collectionsUpdated.asObservable();
  }

  putDynamicColumns(value) {
    this.dynamicColumns = value;
  }
  putDynamicKeyVal(value) {
    this.dynamicKeyVal = value;
  }

  getDynamicColumns() {
    return this.dynamicColumns;
  }

  passKeyValue(FileName, Value) {
    this.http
      .post<{ message: string }>(
        'http://localhost:3000/api/machines/keyvalues',
        { Name: FileName, Data: Value },
        this.config
      )
      .subscribe((respData) => {
        console.log(respData.message);
        this.machinesUpdated.next([...this.machines]);
      });
  }

  passusercollection(val) {
    this.collectionchoosed = val;
    console.log('MachineService: ', val);
    this.http
      .post<{ message: string }>(
        'http://localhost:3000/api/machines/usercollection',
        { collection: val },
        this.config
      )
      .subscribe((respData) => {
        this.getMachines(),
          this.getMachineKeyVals(),
          console.log(respData.message);
      });
  }

  importCsv(fileName, csvData) {
    this.http
      .post<{ message: string }>(
        'http://localhost:3000/api/machines/import',
        { Name: fileName, Data: csvData },
        this.config
      )
      .subscribe((respData) => {
        console.log(respData.message);
        this.getCollections();
        this.machinesUpdated.next([...this.machines]);
      });
  }

  addData(data) {
    this.http
      .post<{ message: string }>('http://localhost:3000/api/machines', data)
      .subscribe((respData) => {
        console.log(respData.message);
        this.machinesUpdated.next([...this.machines]);
      });
  }

  addRole(data) {
    this.http
      .post<{ message: string }>(
        'http://localhost:3000/api/users/addrole',
        data,
        this.config
      )
      .subscribe((respData) => {
        console.log(respData.message);
        // this.machinesUpdated.next([...this.machines]);
        this.rolesUpdated.next([...this.roles]);
      });
  }

  getHeaders(headers) {
    console.log('Received the headers in service.js', headers);
    this.http
      .post<{ message: string }>(
        'http://localhost:3000/api/machines/passHeaders',
        headers,
        this.config
      )
      .subscribe((respData) => {
        console.log(respData.message);
      });
  }

  postId(id: string) {
    this.editId = id;
  }
  getId() {
    return this.editId;
  }

  getMachine(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      type: string;
      signal: string;
      angSignal: string;
      modbus: number;
    }>('http://localhost:3000/api/machines/' + id);
  }

  addMachine(
    name: string,
    type: string,
    signal: string,
    angSignal: string,
    modbus: number
  ) {
    const machine: Machine = {
      id: null,
      name: name,
      type: type,
      signal: signal,
      angSignal: angSignal,
      modbus: modbus,
    };
    this.http
      .post<{ message: string; machineId: string }>(
        'http://localhost:3000/api/machines',
        machine
      )
      .subscribe((respData) => {
        console.log(respData.message);
        const id = respData.machineId;
        machine.id = id;
        this.machines.push(machine);
        this.machinesUpdated.next([...this.machines]);
      });
  }

  updateMachine(
    id: string,
    name: string,
    type: string,
    signal: string,
    angSignal: string,
    modbus: number
  ) {
    const machine: Machine = {
      id: id,
      name: name,
      type: type,
      signal: signal,
      angSignal: angSignal,
      modbus: modbus,
    };
    this.http
      .put('http://localhost:3000/api/machines/' + id, machine)
      .subscribe((res) => {
        console.log('At machine update service: ', machine);
        const updatedMachines = [...this.machines];
        const oldMachineIndex = updatedMachines.findIndex(
          (m) => m.id === machine.id
        );
        updatedMachines[oldMachineIndex] = machine;
        this.machines = updatedMachines;
        this.machinesUpdated.next([...this.machines]);
      });
  }

  deleteMachine(machineId: string) {
    this.http
      .delete('http://localhost:3000/api/machines/' + machineId)
      .subscribe(() => {
        console.log('Deleted!');
        const updatedMachines = this.machines.filter(
          (machine) => machine.id !== machineId
        );
        this.machines = updatedMachines;
        this.machinesUpdated.next([...this.machines]);
      });
  }
}
