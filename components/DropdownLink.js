import Link from 'next/link';

export default function DropdownLink(props) {
  let { href, children, ...rest } = props;
  return (
    <Link href={href}>
      {/* Put the rest of properties in the component in the anchor and render the children. */}
      <a {...rest}>{children}</a>
    </Link>
  );
}
