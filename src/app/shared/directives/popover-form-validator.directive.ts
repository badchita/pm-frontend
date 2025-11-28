import {
  ApplicationRef,
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  Injector,
  createComponent,
  OnDestroy,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { fromEvent, merge, Subscription } from 'rxjs';
import { PopoverFormValidatorContainerComponent } from '../components/popover-form-container-validator/popover-form-validator-container.component';

@Directive({
  selector: '[appPopoverFormValidator]',
  standalone: true,
})
export class PopoverFormValidatorDirective implements OnDestroy {
  private el = inject(ElementRef);
  private control = inject(NgControl, { optional: true });
  private injector = inject(Injector);
  private appRef = inject(ApplicationRef);

  private componentRef?: ComponentRef<PopoverFormValidatorContainerComponent>;
  private positionSub?: Subscription;

  @HostListener('keydown.enter')
  @HostListener('input')
  onInteraction() {
    this.showIfInvalid();
  }

  private showIfInvalid() {
    if (!this.control || this.control.valid) {
      this.hide();
      return;
    }

    if (!this.componentRef) {
      this.create();
      this.listenToPositionChanges();
    }

    this.componentRef?.setInput('control', this.control);

    const popover = this.getPopoverElement();
    if (popover) {
      this.position(popover);
    }
  }

  private create() {
    this.componentRef = createComponent(PopoverFormValidatorContainerComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector,
    });

    this.appRef.attachView(this.componentRef.hostView);

    const popover = this.getPopoverElement();
    popover?.classList.add('custom-popover');

    document.body.appendChild(popover!);
  }

  private getPopoverElement(): HTMLElement | null {
    return (this.componentRef?.hostView as any)?.rootNodes?.[0] ?? null;
  }

  private position(popover: HTMLElement) {
    const update = () => {
      const inputRect = this.el.nativeElement.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const spacing = 12;
      const arrowTop = popoverRect.height > 55 ? 20 : 50;

      let top = inputRect.top;
      let left = inputRect.right + spacing;

      if (left + popoverRect.width > viewportWidth) {
        left = inputRect.left - popoverRect.width - spacing;
        popover.classList.add('left');
        popover.classList.remove('right');
      } else {
        popover.classList.add('right');
        popover.classList.remove('left');
      }

      popover.style.position = 'fixed';
      popover.style.top = `${top}px`;
      popover.style.left = `${left}px`;
      popover.style.zIndex = '9999';
      popover.style.setProperty('--arrow-top', `${arrowTop}%`);
    };

    // Initial positioning
    update();

    // Observe content changes
    const observer = new ResizeObserver(update);
    observer.observe(popover);

    // Optionally disconnect when hiding popover
  }

  private listenToPositionChanges() {
    this.positionSub = merge(fromEvent(window, 'scroll'), fromEvent(window, 'resize')).subscribe(
      () => {
        const popover = this.getPopoverElement();
        if (popover) {
          this.position(popover);
        }
      }
    );
  }

  private hide() {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = undefined;
    }

    this.positionSub?.unsubscribe();
    this.positionSub = undefined;
  }

  ngOnDestroy() {
    this.hide();
  }
}
