import TrackLinkItem from "./TrackLinkItem";

function TrackLinkList({ links, onDeleteTrackLink }) {
  return (
    <>
      <h3>Track Links</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Url</th>
            <th>Track.ID</th>
            <th>update</th>
            <th>delete</th>
          </tr>
        </thead>
        <tbody>
          {links.map((tl) => (
            <TrackLinkItem
              key={tl.id}
              trackLink={tl}
              onDeleteTrackLink={onDeleteTrackLink}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}

export default TrackLinkList;
