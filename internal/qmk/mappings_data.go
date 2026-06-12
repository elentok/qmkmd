package qmk

// MappingGroups is the single source of truth for the simple-key mapping table.
// It feeds both buildSimpleMappings (the compiler) and the documentation
// generator under internal/qmk/gen (run via `go generate ./...`).
//
// Groups with Entries contribute those short -> QMK pairs to the compiler.
// Groups with only a Lead are documentation-only descriptions of mappings that
// the compiler derives programmatically (letters, digits, function keys, mods).
type MappingGroup struct {
	Title   string
	Lead    string
	Entries []MappingEntry
}

type MappingEntry struct {
	Short string
	QMK   string
	Note  string
}

var MappingGroups = []MappingGroup{
	{
		Title: "Letters & digits",
		Lead:  "`a`–`z`, `0`–`9` → `KC_A` … `KC_9`.",
	},
	{
		Title: "Function keys",
		Lead:  "`f1`–`f12` → `KC_F1` … `KC_F12`.",
	},
	{
		Title: "Named keys",
		Entries: []MappingEntry{
			{Short: "esc", QMK: "KC_ESC"},
			{Short: "tab", QMK: "KC_TAB"},
			{Short: "bs", QMK: "KC_BSPC"},
			{Short: "del", QMK: "KC_DEL"},
			{Short: "spc", QMK: "KC_SPC"},
			{Short: "ent", QMK: "KC_ENT"},
			{Short: "left", QMK: "KC_LEFT"},
			{Short: "right", QMK: "KC_RIGHT"},
			{Short: "up", QMK: "KC_UP"},
			{Short: "down", QMK: "KC_DOWN"},
			{Short: "home", QMK: "KC_HOME"},
			{Short: "end", QMK: "KC_END"},
			{Short: "pgup", QMK: "KC_PGUP"},
			{Short: "pgdn", QMK: "KC_PGDN"},
			{Short: "wbak", QMK: "KC_WBAK"},
			{Short: "wfwd", QMK: "KC_WFWD"},
			{Short: "pscr", QMK: "KC_PSCR"},
		},
	},
	{
		Title: "Media / system",
		Entries: []MappingEntry{
			{Short: "play", QMK: "KC_MPLY"},
			{Short: "boot", QMK: "QK_BOOT"},
			{Short: "vol+", QMK: "KC_VOLU"},
			{Short: "vol-", QMK: "KC_VOLD"},
			{Short: "copy", QMK: "KC_COPY"},
			{Short: "paste", QMK: "KC_PSTE"},
		},
	},
	{
		Title: "Modifiers",
		Lead:  "`lgui rgui lctl rctl lalt ralt lsft rsft` → `KC_LGUI` … `KC_RSFT`.",
	},
	{
		Title: "Punctuation & symbols",
		Entries: []MappingEntry{
			{Short: "'", QMK: "KC_QUOT"},
			{Short: "quot", QMK: "KC_QUOT"},
			{Short: "\"", QMK: "KC_DQUO"},
			{Short: ",", QMK: "KC_COMM"},
			{Short: ".", QMK: "KC_DOT"},
			{Short: ";", QMK: "KC_SCLN"},
			{Short: ":", QMK: "KC_COLN"},
			{Short: "`", QMK: "KC_GRV"},
			{Short: "~", QMK: "KC_TILD"},
			{Short: "[", QMK: "KC_LBRC"},
			{Short: "]", QMK: "KC_RBRC"},
			{Short: "{", QMK: "KC_LCBR"},
			{Short: "}", QMK: "KC_RCBR"},
			{Short: "(", QMK: "KC_LPRN"},
			{Short: ")", QMK: "KC_RPRN"},
			{Short: "<", QMK: "KC_LABK"},
			{Short: ">", QMK: "KC_RABK"},
			{Short: "=", QMK: "KC_EQL"},
			{Short: "-", QMK: "KC_MINS"},
			{Short: "+", QMK: "KC_PLUS"},
			{Short: "_", QMK: "KC_UNDS"},
			{Short: "|", QMK: "KC_PIPE"},
			{Short: "/", QMK: "KC_SLSH"},
			{Short: "\\", QMK: "KC_BSLS"},
			{Short: "?", QMK: "KC_QUES"},
			{Short: "!", QMK: "KC_EXLM"},
			{Short: "@", QMK: "KC_AT"},
			{Short: "#", QMK: "KC_HASH"},
			{Short: "$", QMK: "KC_DLR"},
			{Short: "%", QMK: "KC_PERC"},
			{Short: "^", QMK: "KC_CIRC"},
			{Short: "&", QMK: "KC_AMPR"},
			{Short: "*", QMK: "KC_ASTR"},
		},
	},
	{
		Title: "Special",
		Entries: []MappingEntry{
			{Short: "__", QMK: "_______", Note: "Transparent / fall through"},
			{Short: "no", QMK: "KC_NO", Note: "Does nothing"},
			{Short: "noop", QMK: "KC_NO", Note: "Does nothing"},
		},
	},
}
