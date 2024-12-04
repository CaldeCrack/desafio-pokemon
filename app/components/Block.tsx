export default function Block(elem: any) {
	const content = elem.children.content ? elem.children.content : elem.children;
	const style = elem.children.style ? elem.children.style : null;

	return (
		<div className="flex flex-col w-1/3 p-4 bg-zinc-800 rounded-3xl ring-[2px] ring-green-700 gap-3"
			style={style}>
			{content}
		</div>
	)
}
