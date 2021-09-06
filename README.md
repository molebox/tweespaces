
# 🐤 tweespaces

A node CLI for querying the Twitter spaces API.


## Installation

No need to install anything, just use `npx` 🕺

```bash
 npx tweespaces --live --query="developer"
```

## API Reference

There are 4 flags:

- `--live` - (alias: `--l`) - All spaces that are live now and match the query.
- `--scheduled` - (alias: `--s`) - All spaces that are scheduled to be run and match the query.
- `--query=""` - (alias: `--q=""`) - The keyword to query. This can be any text (including mentions and Hashtags).
- `--host=""` - (alias: `--h=""`) - All spaces that have been scheduled by the given host. This is someones twitter handle. For example `--host="studio_hungry"`


### Show all live spaces with "developer" in the title

```bash
  npx tweespaces --live --query="developer"
```

### Show all scheduled spaces with "developer" in the title

```bash
  npx tweespaces --scheduled --query="developer"
```

### Show all scheduled spaces from the user "studio_hungry"

```bash
  npx tweespaces --host="studio_hungry"
```

## Result

!['A GIF of running a tweespace command. Shows the CLI output'](tweespaces.gif)

## Author

- GitHub: [@molebox](https://www.github.com/molebox)
- Twitter: [@studio_hungry](https://twitter.com/studio_hungry)

