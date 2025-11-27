import {
  ApplicationRef,
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  Injector,
  createComponent,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { PopoverFormValidatorContainerComponent } from '../components/popover-form-container-validator/popover-form-validator-container.component';

@Directive({
  selector: '[appPopoverFormValidator]',
  standalone: true,
})
export class PopoverFormValidatorDirective {
  private el = inject(ElementRef);
  private control = inject(NgControl, { optional: true });
  private injector = inject(Injector);
  private appRef = inject(ApplicationRef);

  private componentRef?: ComponentRef<PopoverFormValidatorContainerComponent>;

  @HostListener('keydown.enter')
  onEnter() {
    this.showIfInvalid();
  }

  @HostListener('input')
  onInput() {
    this.showIfInvalid();
  }

  private showIfInvalid() {
    if (!this.control || this.control.valid) {
      this.hide();
      return;
    }

    if (!this.componentRef) {
      this.create();
    }

    this.componentRef?.setInput('errors', this.control?.errors);
  }

  private create() {
    this.componentRef = createComponent(PopoverFormValidatorContainerComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector,
    });

    this.appRef.attachView(this.componentRef.hostView);

    const domElem = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;
    domElem.classList.add('custom-popover');

    document.body.appendChild(domElem);
    this.position(domElem);
  }

  private position(popover: HTMLElement) {
    const rect = this.el.nativeElement.getBoundingClientRect();

    popover.style.position = 'fixed';
    popover.style.top = `${rect.top + 8}px`;
    popover.style.left = `${rect.right + 20}px`;
    // popover.style.zIndex = '9999';
  }

  private hide() {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }
}
// import {
//   ConnectedPosition,
//   FlexibleConnectedPositionStrategy,
//   Overlay,
//   OverlayRef,
//   PositionStrategy,
// } from '@angular/cdk/overlay';
// import { ComponentPortal } from '@angular/cdk/portal';
// import {
//   AfterViewInit,
//   Directive,
//   ElementRef,
//   HostListener,
//   Injector,
//   Input,
//   OnDestroy,
//   ViewContainerRef,
//   inject,
// } from '@angular/core';
// import {
//   POPOVER_FORM_DATA,
//   PopoverFormData,
//   PopoverFormValidatorContainerComponent,
// } from '../components/popover-form-container-validator/popover-form-validator-container.component';
// // import {
// //   TOOLTIP_DATA,
// //   TooltipContainerComponent,
// //   TooltipData
// // } from '../components/tooltip-container/tooltip-container.component';

// @Directive({
//   selector: '[appPopoverFormValidator]',
// })
// export class PopoverFormValidatorDirective implements OnDestroy, AfterViewInit {
//   private element = inject<ElementRef<HTMLElement>>(ElementRef);
//   private overlay = inject(Overlay);
//   private viewContainer = inject(ViewContainerRef);

//   // TODO: Skipped for migration because:
//   //  Class of this input is manually instantiated. This is discouraged and prevents
//   //  migration.
//   @Input() appTooltip!: PopoverFormData;
//   // TODO: Skipped for migration because:
//   //  Class of this input is manually instantiated. This is discouraged and prevents
//   //  migration.
//   @Input() tooltipWidth: number | string = 'auto';
//   // TODO: Skipped for migration because:
//   //  Class of this input is manually instantiated. This is discouraged and prevents
//   //  migration.
//   @Input() tooltipPosition = 'right';
//   // TODO: Skipped for migration because:
//   //  Class of this input is manually instantiated. This is discouraged and prevents
//   //  migration.
//   @Input() tooltipDelay = 0;
//   // TODO: Skipped for migration because:
//   //  Class of this input is manually instantiated. This is discouraged and prevents
//   //  migration.
//   @Input() tooltipIsActive = true;
//   // TODO: Skipped for migration because:
//   //  Class of this input is manually instantiated. This is discouraged and prevents
//   //  migration.
//   @Input() tooltipHasMaxWidth = false;

//   @Input() tooltipIsOverflowing = false;

//   currentTooltipText = '';

//   private overlayRef: OverlayRef | null = null;

//   private intersectionObserver?: IntersectionObserver;
//   private isFullyVisible = true;

//   ngAfterViewInit(): void {
//     this.intersectionObserver = new IntersectionObserver(
//       ([entry]) => {
//         this.isFullyVisible = entry.intersectionRatio === 1;
//       },
//       {
//         root: null,
//         threshold: 1.0,
//       }
//     );

//     this.intersectionObserver.observe(this.element.nativeElement);
//   }

//   // @HostListener('mouseenter')
//   // @HostListener('focus')
//   // showTooltip(): void {
//   //   if (this.overlayRef?.hasAttached() === true) {
//   //     return;
//   //   }

//   //   this.currentTooltipText = this.appTooltip.toString();

//   //   setTimeout(() => {
//   //     if (this.currentTooltipText === this.appTooltip.toString() && this.tooltipIsActive)
//   //       this.attachTooltip();
//   //   }, this.tooltipDelay);
//   // }

//   // @HostListener('mouseleave')
//   // @HostListener('blur')
//   // hideTooltip(): void {
//   //   this.currentTooltipText = '';
//   //   if (this.overlayRef?.hasAttached() === true) {
//   //     this.overlayRef?.detach();
//   //   }
//   // }

//   @HostListener('input')
//   onInput() {
//     this.currentTooltipText = this.appTooltip.toString();

//     setTimeout(() => {
//       if (this.currentTooltipText === this.appTooltip.toString() && this.tooltipIsActive)
//         this.attachTooltip();
//     }, this.tooltipDelay);
//   }

//   private attachTooltip(): void {
//     if (this.appTooltip === '') {
//       return;
//     }

//     if (this.overlayRef?.hasAttached() === true) {
//       this.overlayRef?.detach();
//     }

//     const positionStrategy = this.getPositionStrategy() as FlexibleConnectedPositionStrategy;
//     const currentPosition = positionStrategy.positions[0];

//     if (currentPosition.panelClass) {
//       const modifier = this.tooltipIsOverflowing ? 'overflow' : !this.isFullyVisible ? 'half' : '';

//       currentPosition.panelClass = modifier
//         ? `${currentPosition.panelClass}-${modifier}`
//         : currentPosition.panelClass;
//     }

//     this.overlayRef = this.overlay.create({
//       positionStrategy,
//       width: this.tooltipWidth,
//       maxWidth: this.tooltipHasMaxWidth ? this.tooltipWidth : 'auto',
//     });

//     const maxWidthText = 40;
//     const words = this.appTooltip.toString().split(' ');
//     const appTooltipText =
//       this.tooltipHasMaxWidth && this.tooltipWidth !== 'auto'
//         ? words
//             .map((word) => {
//               return word.length > maxWidthText
//                 ? [word.slice(0, maxWidthText), word.slice(maxWidthText)].join(' ')
//                 : word;
//             })
//             .join(' ')
//         : this.appTooltip;

//     const injector = Injector.create({
//       providers: [
//         {
//           provide: POPOVER_FORM_DATA,
//           useValue: appTooltipText,
//         },
//       ],
//     });
//     const component = new ComponentPortal(
//       PopoverFormValidatorContainerComponent,
//       this.viewContainer,
//       injector
//     );
//     this.overlayRef.attach(component);
//   }

//   private getPositionStrategy(): PositionStrategy {
//     const positions: ConnectedPosition[] = [
//       {
//         originX: 'center',
//         originY: 'top',
//         overlayX: 'center',
//         overlayY: 'bottom',
//         panelClass: 'top',
//       },
//       {
//         originX: 'center',
//         originY: 'bottom',
//         overlayX: 'center',
//         overlayY: 'top',
//         panelClass: 'bottom',
//       },
//       {
//         originX: 'start',
//         originY: 'center',
//         overlayX: 'end',
//         overlayY: 'center',
//         panelClass: 'left',
//       },
//       {
//         originX: 'end',
//         originY: 'center',
//         overlayX: 'start',
//         overlayY: 'center',
//         panelClass: 'right',
//       },
//     ];

//     return this.overlay
//       .position()
//       .flexibleConnectedTo(this.element)
//       .withPositions(positions.filter((p) => p.panelClass === this.tooltipPosition));
//   }

//   ngOnDestroy(): void {
//     this.overlayRef?.dispose();
//   }
// }
