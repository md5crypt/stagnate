import { JSX, StagnateNode } from "./types"

class SlotArray extends Array<StagnateNode> {
	public readonly name: string
	constructor (name: string, elements: StagnateNode) {
		super()
		this.name = name
		this.push(elements)
	}
}

/**
 * Pseudo component used to create named slots.
 *
 * example use:
 * ```typescript
 * function Foo(props: {children: StagnateNode}) {
 *   const slots = Slot.extract<{foo: HTMLElement, bar: HTMLElement}>(props.children)
 *   return <div>
 *     <div>{slots.foo}</div>
 *     <div>{slots.bar}</div>
 *    </div>
 * }
 *
 * const example = <Foo>
 *   <Slot name="foo">FOO</Slot>
 *   <Slot name="bar">BAR</Slot>
 * </Foo>
 * ```
 */
export function Slot(props: {name: string, children: StagnateNode}): JSX.Element {
	return new SlotArray(props.name, props.children) as any
}

export namespace Slot {
	/**
	 * This function extracts slotted children from the child list,
	 * it has to be called if slots are in the child list or render will fail on un-extracted slot data.
	 *
	 * see {@link Slot} for a usage example
	 */
	export function extract<T = Record<string, any>>(input: StagnateNode, slots: Record<string, any> = {}) {
		if (input instanceof SlotArray && input.length) {
			slots[input.name] = input[0]
			input.pop()
		} else if (Array.isArray(input)) {
			for (let i = 0; i < input.length; i += 1) {
				const item = input[i]
				if (item instanceof SlotArray) {
					if (input.length) {
						slots[item.name] = item[0]
					}
					input[i] = null
				} else if (Array.isArray(item)) {
					extract(item, slots)
				}
			}
		}
		return slots as T
	}
}
