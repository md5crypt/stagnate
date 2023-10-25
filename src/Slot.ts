import { JSX, StagnateNode } from "./types"

class SlotArray extends Array<StagnateNode> {
	public readonly name: string
	constructor (name: string, elements: StagnateNode) {
		super()
		this.name = name
		this.push(elements)
	}
}

export function Slot(props: {name: string, children: StagnateNode}): JSX.Element {
	return new SlotArray(props.name, props.children) as any
}

Slot.extract = function<T = Record<string, any>>(input: StagnateNode, slots: Record<string, any> = {}) {
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
				this.extract(item, slots)
			}
		}
	}
	return slots as T
}
