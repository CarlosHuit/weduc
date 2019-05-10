export class ChangeStateDrawer {

  static readonly type = '[Drawer] change status';
  constructor(public payload: { status: boolean }) {}

}


export class CloseDrawer {

  static readonly type = '[Drawer] close drawer';

}
