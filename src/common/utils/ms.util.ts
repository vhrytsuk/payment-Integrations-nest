/**
 * Time unit literals accepted by {@link ms}.
 * Covers long, short and plural spellings in any letter casing.
 */
type Unit =
	| 'Years'
	| 'Year'
	| 'Yrs'
	| 'Yr'
	| 'Y'
	| 'Months'
	| 'Month'
	| 'Mo'
	| 'Weeks'
	| 'Week'
	| 'W'
	| 'Days'
	| 'Day'
	| 'D'
	| 'Hours'
	| 'Hour'
	| 'Hrs'
	| 'Hr'
	| 'H'
	| 'Minutes'
	| 'Minute'
	| 'Mins'
	| 'Min'
	| 'M'
	| 'Seconds'
	| 'Second'
	| 'Secs'
	| 'Sec'
	| 'S'
	| 'Milliseconds'
	| 'Millisecond'
	| 'Msecs'
	| 'Msec'
	| 'Ms';

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

/**
 * A human readable duration such as `'4d'`, `'2 hours'`, `'-1.5h'` or `'100'`.
 */
export type StringValue =
	`${number}` | `${number}${UnitAnyCase}` | `${number} ${UnitAnyCase}`;

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365.25;

/** Maps every supported (lowercased) unit spelling to its length in milliseconds. */
const UNIT_TO_MS: Record<Lowercase<Unit>, number> = {
	years: YEAR,
	year: YEAR,
	yrs: YEAR,
	yr: YEAR,
	y: YEAR,
	months: MONTH,
	month: MONTH,
	mo: MONTH,
	weeks: WEEK,
	week: WEEK,
	w: WEEK,
	days: DAY,
	day: DAY,
	d: DAY,
	hours: HOUR,
	hour: HOUR,
	hrs: HOUR,
	hr: HOUR,
	h: HOUR,
	minutes: MINUTE,
	minute: MINUTE,
	mins: MINUTE,
	min: MINUTE,
	m: MINUTE,
	seconds: SECOND,
	second: SECOND,
	secs: SECOND,
	sec: SECOND,
	s: SECOND,
	milliseconds: 1,
	millisecond: 1,
	msecs: 1,
	msec: 1,
	ms: 1
};

/** Matches `123`, `1.5h`, `-2 days`, `1e3 ms`, ... */
const DURATION_PATTERN = /^(-?(?:\d+)?\.?\d+(?:e[-+]?\d+)?)\s*([a-z]*)$/i;

/**
 * Converts a human readable duration string into milliseconds.
 *
 * @example
 * ms('4d');        // 345_600_000
 * ms('2h');        // 7_200_000
 * ms('1.5 hours'); // 5_400_000
 * ms('-30m');      // -1_800_000
 * ms('100');       // 100
 *
 * @throws {TypeError} When the value is not a parsable duration string.
 */
export function ms(value: StringValue): number {
	if (typeof value !== 'string' || value.length === 0) {
		throw new TypeError(
			`Value provided to ms() must be a non-empty string. Received: ${JSON.stringify(value)}`
		);
	}

	if (value.length > 100) {
		throw new TypeError(
			'Value provided to ms() exceeds the maximum length of 100 characters.'
		);
	}

	const match = DURATION_PATTERN.exec(value.trim());

	if (!match) {
		throw new TypeError(
			`Value provided to ms() is not a valid duration: "${value}"`
		);
	}

	const [, rawAmount, rawUnit] = match;
	const amount = Number.parseFloat(rawAmount);

	if (Number.isNaN(amount)) {
		throw new TypeError(
			`Value provided to ms() is not a valid number: "${value}"`
		);
	}

	const unit = (rawUnit || 'ms').toLowerCase() as Lowercase<Unit>;
	const multiplier = UNIT_TO_MS[unit];

	if (multiplier === undefined) {
		throw new TypeError(`Unknown time unit "${rawUnit}" provided to ms().`);
	}

	return amount * multiplier;
}

/**
 * Same as {@link ms} but returns `undefined` instead of throwing on invalid input.
 */
export function msSafe(value: string): number | undefined {
	try {
		return ms(value as StringValue);
	} catch {
		return undefined;
	}
}
