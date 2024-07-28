create table if not exists definitions(
  id text primary key,
  [name] text not null unique,
  [enabled] int default 0,
  schdStartDate date,
  schdStartTime text,
  schdEndDate date,
  schdEndTime text,
  schdInterval text,
  execId text,
  script text,
  scriptArgs text,
  created text default current_timestamp,
  updated text default current_timestamp
);

create table if not exists executors(
  id text primary key,
  [name] text not null unique,
  [path] text,
  created text default current_timestamp,
  updated text default current_timestamp
);

create table if not exists jobs(
  id text primary key,
  defId text not null,
  execPath text,
  scriptPath text,
  scriptArgs text,
  startTime text,
  endTime text,
  elapsed text,
  [status] text default 'Scheduled',
  stdLog text,
  errLog text,
  exitCode int,
  created text default current_timestamp,
  updated text default current_timestamp
);