import { Pipe, PipeTransform } from "@angular/core";
type AbstractType<T> = abstract new (...args: unknown[]) => T;
@Pipe({
  name: "instanceof",
  standalone: true,
})
/**
 * check withe a value is an instance of the give class.
 * NOTE: the class to be checked (value instance of **class**) MUST be exported from the component. Using `{{val |instanceof Date}}`required you expose a aliand from the component : `public readonly Date = Date;`
 *
 */
export class InstanceofPipe implements PipeTransform {
  /**
   * @param value : the value to check class
   * @param type: the class to check
   * @returns tue if value is an instance of class, false otherwise.
   */
  public transform<V, R>(value: V, type: AbstractType<R>): boolean {
    return value instanceof type;
  }
}
