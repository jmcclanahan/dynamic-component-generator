import {
  Component,
  Directive,
  ComponentFactory,
  ComponentMetadata,
  ComponentResolver,
  Input,
  ReflectiveInjector,
  ViewContainerRef,
  OnInit
} from '@angular/core'

@Directive({
    selector: 'dynamic-html-outlet',
})
export class DynamicHtmlOutlet implements OnInit {
  @Input() src: string;
  @Input() item: any;

  constructor(private vcRef: ViewContainerRef, private resolver: ComponentResolver) {
  }

  ngOnInit() {
    if (!this.src) return;

    const metadata = new ComponentMetadata({
        selector: 'sol-dynamic-html',
        template: this.src
    });

    this.createComponentFactory(this.resolver, metadata)
      .then(factory => {
        // Create Injector for Component
        const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);

        // Create Component with factory and injector. 0 = index which determines where in the
        // container the component will be rendered. 0 means it will be rendered starting at the
        // beginning
        const componentRef = this.vcRef.createComponent(factory, 0, injector, []);

        // Define any parameters you want to pass to the newly generated component
        componentRef.instance.item = this.item;
      });
  }

  createComponentFactory(resolver: ComponentResolver, metadata: ComponentMetadata): Promise<ComponentFactory<any>> {
    // Define component to create
    const cmpClass =  class DynamicComponent {};

    // Define component and metadata(ie @Component())
    const decoratedCmp = Component(metadata)(cmpClass);

    // Return ComponentFactory to create components with
    return resolver.resolveComponent(decoratedCmp);
  }
}
