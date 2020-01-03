import { GameEvent, EventType } from '../event/EventRegistry';

export const eventToString = (e: GameEvent) => {
    const date = new Date(e.ts);
    const formattedDate = `${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${date
        .getSeconds()
        .toString()
        .padStart(2, '0')}:${date
        .getMilliseconds()
        .toString()
        .padStart(3, '0')}`;
    switch (e.type) {
        case EventType.ATTACK:
            return `[${formattedDate}] ${e.from.type} attacked ${e.to.type}.`;
        case EventType.DAMAGE_DEALT:
            return `[${formattedDate}] ${e.to.type} received ${Math.abs(e.damage)} damage.`;
        case EventType.ITEM_PICKED_UP:
            return `[${formattedDate}] ${e.by.type} picked up item ${e.item.type}.`;
        case EventType.ITEM_USED:
            return `[${formattedDate}] Item ${e.item.type} used by ${e.by.type}.`;
    }
};
