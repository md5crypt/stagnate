/**
 * Stagnate Component class
 *
 * @typeParam REFS - interface describing jsx references stored on this component, see {@link Component.refs}
 * @typeParam PROPS - interface describing jsx props passed to this component
 * @typeParam ROOT - type of the html root element
 */
export class Component<REFS = {}, PROPS = undefined, ROOT extends SVGElement | HTMLElement = SVGElement | HTMLElement > {
	/** properties received from jsx (or set via constructor) */
	public readonly props: PROPS extends undefined ? {} : PROPS

	private _components: Component<any, any, any>[]
	private _attached: boolean

	/** html root element, only accessible after {@link build} was called */
	protected root!: ROOT

	/**
	 * parent component, only accessible after {@link bind} was called
	 * for self-bound components `this.parent = this`
	 */
	protected parent!: Component<any, any>

	/**
	 * jsx references stored on this component,
	 * the REFS type should be set to a interface describing what references the component will use
	 * see {@link ref} for how to set references
	 */
	protected refs: REFS

	/**
	 * if component is to be used from jsx it has to have one constructor argument being the props,
	 * any other constructor signature will fail when used from jsx
	 */
	public constructor(...props: PROPS extends undefined ? [] : [props: PROPS])
	public constructor(props?: any) {
		this._components = []
		this._attached = false
		this.refs = {} as REFS
		this.props = props
	}

	private attach() {
		for (let i = 0; i < this._components.length; i += 1) {
			const component = this._components[i]
			if (!component._attached) {
				component.attach()
			}
		}
		this._attached = true
		this.onAttach()
	}

	private detach() {
		this._components.forEach(x => x.detach())
		this._components = []
		this._attached = false
		this.refs = {} as REFS
		this.parent = null as any
		this.root = null as any
		this.onDetach()
	}

	/**
	 * component render function, should return the component JSX
	 * if null is returned {@link build} call will fail with an exception
	 */
	protected render(): Element | null {
		return null
	}

	/** called in {@link build} before render is called */
	protected onBeforeRender() {
	}

	/** called in {@link build} after render is called and root is set */
	protected onRender() {
	}

	/**
	 * called when component if fully attached (children are attached and `this.attached = true`),
	 * `onAttach` will be called only if the component is bound to a parent component or the component
	 * is self-bound
	 */
	protected onAttach() {
	}

	/**
	 * called when component if fully detached (children are detached and `this.attached = false`),
	 * `onDetach` will be called only if the component is bound to a parent component or it {@link destroy} was
	 * called on the component directly
	 */
	protected onDetach() {
	}

	/**
	 * function meant to be used in jsx for binding references
	 *
	 * the following will bind the div under `this.refs.foo` and requires the `REFS` type to include `{foo: HTMLDivElement}`
	 * ```
	 * <div ref={this.ref("foo")} />
	 * ```
	 *
	 * the following will bind the child component under `this.refs.bar` and requires the `REFS` type to include `{bar: BarComponent}`
	 * ```
	 * <BarComponent ref={this.ref("bar")} />
	 * ```
	 *
	 * the following will bind the child component without adding it to refs
	 * ```
	 * <BarComponent ref={this.ref()} />
	 * ```
	 */
	protected ref<T extends keyof REFS | undefined = undefined>(key?: T) {
		return (x: REFS[NonNullable<T>] extends never ? any : REFS[NonNullable<T>]) => {
			if (x instanceof Component) {
				x.parent = this
				this._components.push(x)
				if (this._attached) {
					x.attach()
				}
			}
			if (key) {
				this.refs[key] = x
			}
		}
	}

	/**
	 * calls {@link render} and sets {@link root}
	 * @returns the created DOM element ({@link root})
	 */
	public build() {
		this.onBeforeRender()
		const html = this.render()
		if (!html) {
			throw new Error("can not render component: render function returned null")
		}
		this.root = html as ROOT
		this.onRender()
		return html
	}

	/**
	 * add component to a parent component,
	 * attach component if parent component is attached
	 *
	 * a component can be self-bound by passing itself as parent (`x.bind(x)`),
	 * self-bound components get automatically attached
	 */
	public bind(parent: Component<any, any>) {
		this.parent = parent
		if (parent != this) {
			parent._components.push(this)
			if (parent._attached) {
				this.attach()
			}
		} else {
			this.attach()
		}
	}

	/**
	 * render the component, add it as a child of {@link parent} and insert it into DOM
	 *
	 * calls {@link build} and {@link bind} internally
	 *
	 * @param parent - parent component
	 * @param target - DOM element to add the component to, if unset or null `parent.root` is used, if a component is passed it's root will be used
	 * @param before - add the element before the given DOM child, a number can be used as a child index, if unset adds the element as the last child
	 */
	public create(parent: Component<any, any>, target?: Element | Component<any, any> | null, before?: Element | Component<any, any> | number) {
		if (!target) {
			target = parent.root
		} else if (target instanceof Component) {
			target = target.root
		}
		if (typeof before === "number") {
			before = before < target.children.length ? target.children[Math.max(0, before)] : undefined
		} else if (before instanceof Component) {
			before = before.root
		}
		target.insertBefore(this.build(), before === undefined ? null : before)
		this.bind(parent)
	}

	/**
	 * render the component, add it as a child of {@link parent} and add it to DOM by replacing a existing element or component
	 *
	 * calls {@link build} and {@link bind} internally
	 *
	 * @param parent - parent component
	 * @param target - component or DOM element to replace, if component is passed {@link destroy} will be called on it
	 */
	public replace(parent: Component<any, any>, target: Element | Component<any, any>) {
		if (target instanceof Component) {
			target.root.replaceWith(this.build())
			target.destroy()
		} else {
			target.replaceWith(this.build())
		}
		this.bind(parent)
	}

	/**
	 * render the component, add it to DOM and self-bound, meant to be used for creating the root component
	 *
	 * calls {@link build} and {@link bind} internally
	 *
	 * @param target - DOM target to append the component to
	 */
	public createOrphanized(target: Node) {
		target.appendChild(this.build())
		this.bind(this)
	}

	/** remove this component from DOM and its parent component */
	public destroy() {
		if (this.root) {
			this.root.remove()
		}
		if (this.parent) {
			const index = this.parent._components.indexOf(this)
			if (index >= 0) {
				this.parent._components.splice(index, 1)
			}
		}
		this.detach()
	}

	/** true if component is attached */
	public get attached() {
		return this._attached
	}

	/** public accessor for {@link root} */
	public get htmlRoot() {
		return this.root
	}

	/** child component list accessor */
	public get components(): Readonly<Component<any, any, any>[]> {
		return this._components
	}
}
