import type { ReactNode } from 'react';
import { ActionLink, PageHeading } from '../../components/ui';

/** A room that cannot continue: what happened and a way out. */
export function RoomNotice({ title, children, createAction = false }: { title: string; children: ReactNode; createAction?: boolean }) {
  return <div className="stack-20">
    <PageHeading title={title}>{children}</PageHeading>
    <div className="action-bar">
      {createAction && <ActionLink to="/rooms/new">Create a room</ActionLink>}
      <ActionLink to="/home" variant={createAction ? 'secondary' : 'primary'}>Back to home</ActionLink>
    </div>
  </div>;
}
