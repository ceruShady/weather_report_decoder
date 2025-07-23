export default function DecodedGroup({
  reportGroup,
}: {
  reportGroup: string[];
}) {
  if (reportGroup.length === 0) return null;

  return (
    <div className="cont-decoded-group">
      <h3 className="hdr-decoded-group">{reportGroup[0]}</h3>
      {reportGroup.length > 1 ? (
        <ul className="ul-decoded-group">
          {reportGroup.slice(1).map((aReport, index) => (
            <li key={index}>{aReport}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
