# Stagnate

> React but not reactive, lol

This project started basically as an meme. Yet somehow it ended up being a very useful tool for creating small web apps.

The basic idea is very simple and can be explained in one sentence:
> react but components get rendered only once

This throws out the need for any vDOM as you never need to mutate any already rendered component. Thanks to that components can get rendered directly into DOM in a single pass.

Well... but how do you update anything then? Manually. References to created JSX elements get stored inside the component class for further use.

This library has no dependencies and is simple as it can gets (it's literally ~300 lines of code). For me it's my goto thing when working on smaller things.

## Setup

Intended to be used with typesciprt.

1. npm install stagnate
2. add the following to `compilerOptions` in `tsconfig.json`
```json
{
	"jsx": "react-jsx",
	"jsxImportSource": "stagnate"
}
```

That's it. JSX can now be used within `.tsx` files added to the typescript project.

## Function components

Function components work like in react minus the fact that they don't have any kind of hooks. Because there is no vDOM, calling a function component from code will leave you with a pain HTMLElement.

## Class components

Class components have a simple lifecycle that includes `onAttach` and `onDetach` function calls but there is a major caveat to remember: DOM is not being watched in any way so a component needs to be informed by another already attached component that it has been attached. Same applies to `onDetach`. For it to be called the component needs to know it has been destroyed.

Both of the above can be achieved by correctly binding child components to parent components via `ref` JSX attributes or by manually creating components from code.

### Component root element

Each class component has a single root HTML element. This value is set to the value returned from the `render` function and saved as a protected class property called `root`.

### Properties

Properties are passed as an object in component constructor and available as a readonly `props` class property. They are not used for anything internally, they are simply there to hold attributes passed from JSX.

### Refs object, ref member function and JSX ref attribute

`refs` component class property hold references to all HTML elements and child components that had `ref` JSX attribute set. See example below for a better explanation:

```typescript
class Example extends Component<{foo: HTMLDivElement}> {
	render() {
		return <div>
			<span ref={this.ref("foo")} />
		</div>
	}
}
```

In the example above `this.refs.foo` will point to the `<span>` element (`HTMLSpanElement` instance).

The JSX `ref` attribute works exactly like in react, it accepts a callback with a single argument that gets called when the element / component is created. The value of that argument is a reference to the crated element or (for class components) the created component instance.

The `Component.ref` member function returns a callback to be set as the `ref` JSX attribute. The string argument for that function sets the name under which it should be saved in the `refs` object. For class components it also sets the parent of the created component. It can also be called without argument to just set the parent without saving it under `refs`.

> When using class components in JSX it is important to always bind them or else the `onAttach` / `onDetach` functions will never be called.
>
> For example let's say `Foo` is a class component that has an `onAttach` function defined. We want to use it inside `Bar` component's render function but we don't want it saved under `refs`. What we should do is `<Foo ref={this.ref()} />`. Writing `<Foo />` would crate the component and insert it to DOM, but would never call `onAttach` as the parent would be left unset.

### Creating component programmatically

Three member methods can be used to add (attach) a component into DOM.

#### The `create` member function

```typescript
create(parent: Component, target?: Element | Component | null, before?: Element | Component | number)
```

This method immediately renders the component and appends it to `target`. The component's parent is set to `parent` and the component get's registers as `parent's` child.

If `parent` is attached `onAttach` will be called immediately, if not it will be called once `parent` is attached.

If `target` is `null` then `parent.root` element will be used as `target`.

If `before` is set the element will be inserted before that element.

#### The `replace` member function

```typescript
replace(parent: Component, target: Element | Component)
```

Same as `create` but replaces `target` instead of being appended to it.

#### The `createOrphanized` member function

```typescript
createOrphanized(target?: Element | null)
```

Same as `create` but intended to create the root component. The component is automatically set as attached after render.

If `target` is `null` then component is appended to `document.body`.

## JSX attribute handling

### `ref` attribute

Callback with a single argument that gets called when the element / component is created. The value of that argument is a reference to the crated element or (for class components) the created component instance.

### `class` attribute

In contrast to react `class` in used instead of `className`. What's more the value can be an array. The passed array will be flattened, filtered and then joined to create a single string. This allows writing things like `class={["class1", condition && "class2"]}` without and additional functions or libraries.

### `innerHTML` attribute

It will simply set innerHTML.

### `style` attribute

Does `Object.assign(element.style, value)`

### Event attributes

Every attribute starting with `on` will be treated as an event callback and added using `addEventListener`.

### Other attributes

1. If value is `true` then `setAttribute(attribute, "")` gets called.
2. If value is `false` or `null` then `removeAttribute(attribute)` gets called.
3. If value is a string then `setAttribute(attribute, value)` gets called.
4. if value is `undefined` the attribute is ingored and nothing happens 
5. for all other values `setAttribute(attribute, value.toString())` gets called

## JSX special elements

### `<text>` element

The `<text>` element creates a `Text` node that can be used to bind a `Text` node to component `refs`.

### `<>` element (aka `<Fragment>`)

Same as in react, used to return a array of parents without a root. One thing to remember is that it **does not return a HTMLElement** and should never be used as an component root.

### Slots

Basic slot functionality, see example below:

```typescript
class Layout extends Component<{}, {children: StagnateNode}> {
	render() {
		const slots = Slot.extract<{foo: HTMLElement, bar: HTMLElement}>(this.props.children)
		return <div>
			<div>{slots.foo}</div>
			<div>{slots.bar}</div>
		</div>
	}
}

// <Slot> elements have to be direct children to work
const example = <Layout>
	<Slot name="foo">FOO</Slot>
	<Slot name="bar">BAR</Slot>
</Layout>
```

Primary used to avoid passing nested JSX elements as props.

## Api reference

### Component class
```typescript
/**
 * Stagnate Component class
 *
 * @typeParam REFS - interface describing jsx references stored on this component, see {@link Component.refs}
 * @typeParam PROPS - interface describing jsx props passed to this component
 * @typeParam ROOT - type of the html root element
 */
class Component<REFS = {}, PROPS = undefined, ROOT extends SVGElement | HTMLElement = SVGElement | HTMLElement> {
    /** properties received from jsx (or set via constructor) */
    readonly props: PROPS extends undefined ? {} : PROPS

    /** html root element, only accessible after {@link build} was called */
    protected root: ROOT

    /**
     * parent component, only accessible after {@link bind} was called
     * for self-bound components `this.parent = this`
     */
    protected parent: Component<any, any>

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
    constructor(props: PROPS)

    /**
     * component render function, should return the component JSX
     * if null is returned {@link build} call will fail with an exception
     */
    protected render(): Element | null

    /** called in {@link build} before render is called */
    protected onBeforeRender(): void

    /** called in {@link build} after render is called and root is set */
    protected onRender(): void

    /**
     * called when component if fully attached (children are attached and `this.attached = true`),
     * `onAttach` will be called only if the component is bound to a parent component or the component
     * is self-bound
     */
    protected onAttach(): void

    /**
     * called when component if fully detached (children are detached and `this.attached = false`),
     * `onDetach` will be called only if the component is bound to a parent component or it {@link destroy} was
     * called on the component directly
     */
    protected onDetach(): void

    /** function meant to be used in jsx for binding references */
    protected ref<T extends keyof REFS | undefined = undefined>(key?: T): (x: REFS[NonNullable<T>] extends never ? any : REFS[NonNullable<T>]) => void

    /**
     * calls {@link render} and sets {@link root}
     * @returns the created DOM element ({@link root})
     */
    build(): Element

    /**
     * add component to a parent component,
     * attach component if parent component is attached
     *
     * a component can be self-bound by passing itself as parent (`x.bind(x)`),
     * self-bound components get automatically attached
     */
    bind(parent: Component<any, any>): void

    /**
     * render the component, add it as a child of {@link parent} and insert it into DOM
     *
     * calls {@link build} and {@link bind} internally
     *
     * @param parent - parent component
     * @param target - DOM element to add the component to, if unset or null `parent.root` is used, if a component is passed it's root will be used
     * @param before - add the element before the given DOM child, a number can be used as a child index, if unset adds the element as the last child
     */
    create(parent: Component<any, any>, target?: Element | Component<any, any> | null, before?: Element | Component<any, any> | number): void

    /**
     * render the component, add it as a child of {@link parent} and add it to DOM by replacing a existing element or component
     *
     * calls {@link build} and {@link bind} internally
     *
     * @param parent - parent component
     * @param target - component or DOM element to replace, if component is passed {@link destroy} will be called on it
     */
    replace(parent: Component<any, any>, target: Element | Component<any, any>): void

    /**
     * render the component, add it to DOM and self-bound, meant to be used for creating the root component
     *
     * calls {@link build} and {@link bind} internally
     *
     * @param target - DOM target to append the component to
     */
    createOrphanized(target: Node): void

    /** remove this component from DOM and its parent component */
    destroy(): void

    /** true if component is attached */
    get attached(): boolean

    /** public accessor for {@link root} */
    get htmlRoot(): ROOT

    /** child component list accessor */
    get components(): Readonly<Component<any, any, any>[]>
}
```

### Utility Types

```typescript
/** get props of an JSX element or component function / class */
type ComponentProps<IntrinsicElement | ClassElement | FunctionElement>

/** any value that can be used in JSX */
type StagnateNode

/** the JSX element css class attribute */
type ClassAttribute
```

### Other exports

* `Fragment` - the Fragment JSX component, `<>` can be used as an alias
* `Slot` - the Slots JSX component
* `Slot.extract` - function to extract slots from children (`props.children`)
* `createElement` - can be used if for some reason react-jsx can not be used
* `jsx / jsxs` - exports for react-jsx