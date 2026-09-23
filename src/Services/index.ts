export function parseCursor(cursor: string) {
  const cursors = cursor.split("__$__");
  if (cursors.length !== 2) {
    throw new Error("Invalid Cursor");
  }

  const [rawId, rawCreatedAt] = cursors;
  const id = parseInt(rawId);
  const createdAt = new Date(rawCreatedAt);

  if (isNaN(id) || isNaN(createdAt.getTime())) {
    throw new Error("Invalid Cursor");
  }

  return {
    createdAt_id: {
      createdAt,
      id,
    },
  };
}

export * from "./assignment.service";
export * from "./auth.service";
export * from "./class.service";
export * from "./private_note.service";
export * from "./public_note.service";

