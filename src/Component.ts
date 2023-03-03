export class Component<REFS = {}, PROPS = undefined, ROOT extends SVGElement | HTMLElement = SVGElement | HTMLElement > {
	public readonly props: PROPS extends undefined ? {} : PROPS

	private _components: Component<any, any, any>[]
	private _attached: boolean
	protected root!: ROOT
	protected parent!: Component<any, any>
	protected refs: REFS

	public constructor(...props: PROPS extends undefined ? [] : [never])
	public constructor(props: PROPS)
	public constructor(props?: any) {
		this._components = []
		this._attached = false
		this.refs = {} as REFS
		this.props = props
	}

	protected render(): Element | null {
		return null
	}

	protected ref(key?: keyof REFS) {
		return (x: any) => {
			if (x instanceof Component) {
				x.bind(this as Component<any, any, any>)
			}
			if (key) {
				this.refs[key] = x
			}
		}
	}

	public _jsx() {
		this.onBeforeRender()
		const html = this.render()
		if (!html) {
			throw new Error("can not render component: render function returned null")
		}
		this.root = html as ROOT
		this.onRender()
		return html
	}

	public replace(parent: Component<any, any>, target?: Element | Component<any, any> | null) {
		if (this.root) {
			throw new Error("can not create a already created item")
		}
		if (!target) {
			target = parent.root
		}
		this.onBeforeRender()
		const html = this.render()
		if (!html) {
			throw new Error("can not replace component: render function returned null")
		}
		this.root = html as ROOT
		this.onRender()
		this.parent = parent
		if (target instanceof Component) {
			target.root.replaceWith(html)
			target.destroy()
		} else {
			target.replaceWith(html)
		}
		this.parent._components.push(this)
		if (parent._attached) {
			this.attach()
		}
	}

	public create(parent: Component<any, any>, target?: Element | Component<any, any> | null, before?: Element | Component<any, any> | number) {
		if (this.root) {
			throw new Error("can not create a already created item")
		}
		if (!target) {
			target = parent.root
		} else if (target instanceof Component) {
			target = target.root
		}
		if (typeof before === "number") {
			before = target.children[Math.min(Math.max(0, before), target.children.length - 1)]!
		} else if (before instanceof Component) {
			before = before.root
		}
		this.onBeforeRender()
		const html = this.render()
		if (!html) {
			throw new Error("can not create component: render function returned null")
		}
		this.root = html as ROOT
		this.onRender()
		target.insertBefore(html, before === undefined ? null : before)
		this.parent = parent
		this.parent._components.push(this)
		if (parent._attached) {
			this.attach()
		}
	}

	public createOrphanized(target?: Element | null) {
		if (this.root) {
			throw new Error("can not create a already created item")
		}
		this.onBeforeRender()
		const html = this.render()
		if (!html) {
			throw new Error("can not create component: render function returned null")
		}
		this.root = html as ROOT
		this.onRender()
		target?.appendChild(html)
		this.attach()
	}

	public bind(parent: Component<any, any>, target?: Element) {
		if (target) {
			if (this.root) {
				throw new Error("can not bind a already bound item")
			}
			this.root = target as ROOT
		} else if (!this.root) {
			throw new Error("can not bind not rendered item to itself")
		}
		this.parent = parent
		parent._components.push(this)
		if (parent._attached) {
			this.attach()
		}
	}

	public destroy() {
		this.detach()
		this.refs = {} as REFS
		this.root.remove()
		this.parent._components.splice(this.parent._components.indexOf(this), 1)
		this.parent = null as any
		this.root = null as any
	}

	protected attach() {
		for (let i = 0; i < this._components.length; i += 1) {
			const component = this._components[i]
			if (!component._attached) {
				component.attach()
			}
		}
		this._attached = true
		this.onAttach()
	}

	protected detach() {
		this._components.forEach(x => x.detach())
		this._components = []
		this._attached = false
		this.onDetach()
	}

	public get attached() {
		return this._attached
	}

	public get htmlRoot() {
		return this.root
	}

	protected get components(): Readonly<Component<any, any, any>[]> {
		return this._components
	}

	protected onBeforeRender() {
	}

	protected onRender() {
	}

	protected onAttach() {
	}

	protected onDetach() {
	}
}
