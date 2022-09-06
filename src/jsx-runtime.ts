import type { JSX, CollectableArray } from "./types"

function _collect<T>(data: CollectableArray<T>, accumulator: T[]) {
	for (let i = 0; i < data.length; i += 1) {
		const value = data[i]
		if (Array.isArray(value)) {
			_collect(value, accumulator)
		} else if (value) {
			accumulator.push(value)
		}
	}
}

function collect<T>(data: CollectableArray<T> | T) {
	if (Array.isArray(data)) {
		const accumulator = [] as T[]
		 _collect(data, accumulator)
		return accumulator
	}
	return data ? [data] : []
}

export function jsx(type: any, props: any) {
	const children = collect<Element | string>(props.children)
	if (type == "text") {
		const element = document.createTextNode(children.length ? children.join() : (props.value || ""))
		if (props.ref) {
			props.ref(element)
		}
		return element
	} else if (typeof type == "string") {
		let element: Element
		if (type == "svg" || type == "path") {
			element = document.createElementNS("http://www.w3.org/2000/svg", type)
		} else {
			element = document.createElement(type)
		}
		for (const key in props) {
			if (key == "children") {
				continue
			} else if (key.startsWith("on")) {
				element.addEventListener(key.slice(2).toLowerCase(), props[key])
			} else if (key == "innerHTML") {
				element.innerHTML = props.innerHTML
			} else if (key == "ref") {
				props.ref(element)
			} else if (key == "class") {
				const value = props.class
				element.setAttribute("class", typeof value == "string" ? value : collect(value).join(" "))
			} else if (key == "style") {
				Object.assign((element as HTMLElement).style, props.style)
			} else {
				const value = props[key]
				if (value || value == "") {
					element.setAttribute(key == "viewBox" ? key : key.toLowerCase(), value)
				}
			}
		}
		children.forEach(x => element.appendChild(x instanceof Node ? x : document.createTextNode(x.toString())))
		return element
	} else if ("prototype" in type && type.prototype._jsx) {
		props.children = children
		const component = new type(props)
		const element = component._jsx()
		if (props.ref) {
			props.ref(component)
		}
		return element
	} else {
		props.children = children
		const element = type(props)
		if (props.ref) {
			props.ref(element)
		}
		return element
	}
}

export function createElement(type: any, props: any, ...children: any[]) {
	props.children = children
	return jsx(type, props)
}

export function Fragment(props: {children: any[]}) {
	return props.children
}

export { jsx as jsxs }
export { JSX }
