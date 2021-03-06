import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { CommonModule } from '@angular/common';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsRouterPluginModule, RouterStateSerializer } from '@ngxs/router-plugin';

import { environment as env } from '../../environments/environment';
import { rootState } from './app.state';
import { CustomRouterStateSerializer } from './state/router.state';

@NgModule({

  imports: [

    CommonModule,

    NgxsModule.forRoot(
      rootState,
      { developmentMode: !env.production }
    ),

    NgxsRouterPluginModule.forRoot(),

    NgxsReduxDevtoolsPluginModule.forRoot({
      name:     'weduc',
      maxAge:   25,
      disabled: env.production
    })

  ],

  providers: [
    {
      provide: RouterStateSerializer,
      useClass: CustomRouterStateSerializer
    }
  ],

  exports: [
    NgxsReduxDevtoolsPluginModule,
    NgxsModule
  ]

})

export class NgxsStoreModule {}
