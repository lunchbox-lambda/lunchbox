## Fixture definition
```
{
  id: string,
  type: string,
  pin: number | string,
  dev: string,
  env: string,
  disabled: boolean,
  params: {
    cron: string,
    duration: string,
    always: 'on' | 'off'
  }
}
```


## Description
`id`  
Uniquely represents the fixture in the system. _(required)_

`type`  
The id of the fixture type to be used. _(required)_

`pin` or `dev`  
The mount point of the fixture. It can be a pin on the controller board (ex.: A0, 13) or a device path (ex.: /dev/video0) in case of a camera. _(required)_

`env`  
Name of the environment the fixture belongs to. Environments enable to create logical subsystems where different recipes can run independently from each other. _(required)_

`disabled`  
Temporary disable the fixture therefore it won’t get mounted and managed by the system. __Attention!__ For safety reasons remove the physical connection as well since the voltage-state of this fixture won’t be controlled by the system.

`params`  
This definition is used by regulator controllers. The options below specify the functionality.

__Periodic controller__

`cron`  
Standard [CRON](https://en.wikipedia.org/wiki/Cron) expression used in Unix-like computer operating systems to schedule time-based jobs. This property defines the periodicity _when_ the controller will be turned on.

Patterns
- Asterisk: *  
- Ranges: 1-3, 5  
- Steps: */2

Ranges
- Seconds: 0-59  
- Minutes: 0-59  
- Hours: 0-23  
- Day of Month: 1-31  
- Months: 0-11  
- Day of Week: 0-6

Examples
- &ast; &ast; &ast; &ast; &ast; &ast;  
Runs every second

- 00 00 &ast;/6 &ast; &ast; &ast;  
Runs every six hours

- 00 30 11 &ast; &ast; 1-5  
Runs every weekday (Monday through Friday) at 11:30:00 AM. It does not run on Saturday or Sunday.

`duration`  
Duration in format _PnYnMnDTnHnMnS_ compiling with the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. This property defines _how long_ the controller will be turned on in each period.

Examples
- PT1.5S  
Turned on for one and a half seconds

- PT5M  
Turned on for five minutes

- PT18H  
Turned on for eighteen hours

__Static controller__

`always`  
Value 'on' or 'off' defines whether the controller will be _always_ turned on or off.
