import styles from '../Types.module.css';

export default function Types(types: any) {
	const formatted_types = types.children.map((typeObject: any) => (
		<span key={typeObject.type.name} className={`${styles.type} ${styles[typeObject.type.name]}`}></span>
	));

	return (<div className="flex flex-row gap-2">{formatted_types}</div>)
}
