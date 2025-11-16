import { Flex, Text, Button, Card, ScrollArea, Badge, Heading } from "@radix-ui/themes";

export default function Home() {

  const defaultGap: string = "4";
  const playerCount: number = 0;

  const logs: string = `Nov 16 11:05:01 CRON[3017]: pam_unix(cron:session): session closed for user root

Nov 16 11:05:05 supervisord: valheim-backup DEBUG - [88] - Received signal to backup world

Nov 16 11:05:05 supervisord: valheim-backup INFO - Backing up Valheim server worlds to /config/backups/worlds-20251116-110505.zip

Nov 16 11:05:05 supervisord: valheim-backup   adding: config/worlds_local/ (stored 0%)

Nov 16 11:05:05 supervisord: valheim-backup   adding: config/worlds_local/PatIMat.fwl.old

Nov 16 11:05:05 supervisord: valheim-backup  (deflated 6%)

Nov 16 11:05:05 supervisord: valheim-backup   adding: config/worlds_local/PatIMat.db.old

Nov 16 11:05:05 supervisord: valheim-backup  (deflated 45%)

Nov 16 11:05:05 supervisord: valheim-backup   adding: config/worlds_local/PatIMat.db

Nov 16 11:05:06 supervisord: valheim-backup  (deflated 45%)

Nov 16 11:05:06 supervisord: valheim-backup   adding: config/worlds_local/PatIMat.fwl

Nov 16 11:05:06 supervisord: valheim-backup  (deflated 6%)

Nov 16 11:05:06 supervisord: valheim-backup INFO - Removing backups older than 3 days

Nov 16 11:05:06 supervisord: valheim-backup /config/backups/worlds-20251113-100512.zip

Nov 16 11:06:02 supervisord: valheim-server [Info   :Valheim Plus] Saved 21468 map points to disk.

Nov 16 11:06:02 supervisord: valheim-server 11/16/2025 11:06:02: Console: [Info   :Valheim Plus] Saved 21468 map points to disk.

Nov 16 11:06:03 supervisord: valheim-server 11/16/2025 11:06:03: Console: [Info   : Unity Log] 11/16/2025 11:06:03:  Connections 0 ZDOS:172301  sent:0 recv:0

Nov 16 11:06:03 supervisord: valheim-server 11/16/2025 11:06:03:  Connections 0 ZDOS:172301  sent:0 recv:0

Nov 16 11:11:02 supervisord: valheim-server [Info   :Valheim Plus] Saved 21468 map points to disk.

Nov 16 11:11:02 supervisord: valheim-server 11/16/2025 11:11:02: Console: [Info   :Valheim Plus] Saved 21468 map points to disk.

Nov 16 11:15:01 CRON[3232]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)

Nov 16 11:15:01 CRON[3233]: (root) CMD ([ -f "/var/run/valheim/valheim-updater.pid" ] && kill -HUP $(cat /var/run/valheim/valheim-updater.pid))

Nov 16 11:15:01 CRON[3232]: pam_unix(cron:session): session closed for user root

Nov 16 11:15:01 supervisord: valheim-updater DEBUG - [46] - Received signal to check for update

Nov 16 11:15:01 supervisord: valheim-updater DEBUG - [46] - Kernel: Linux truenas 6.6.44-production+truenas #1 SMP PREEMPT_DYNAMIC Fri Jul 11 12:56:00 UTC 2025 x86_64 GNU/Linux

Nov 16 11:15:01 supervisord: valheim-updater DEBUG - [46] - Found CPU with 1517.582 MHz

Nov 16 11:15:01 supervisord: valheim-updater DEBUG - [46] - Memory total/free/available: 32782180/14122080/17952872

Nov 16 11:15:01 supervisord: valheim-updater DEBUG - [46] - Storage configuration:

Nov 16 11:15:01 supervisord: valheim-updater Filesystem                                Size  Used Avail Use% Mounted on

Nov 16 11:15:01 supervisord: valheim-updater overlay                                   891G   38G  854G   5% /

Nov 16 11:15:01 supervisord: valheim-updater STORAGE/DATA/Game_servers/valheim/config  854G  522M  854G   1% /config

Nov 16 11:15:01 supervisord: valheim-updater STORAGE/DATA/Game_servers/valheim/data    858G  4.6G  854G   1% /opt/valheim

Nov 16 11:15:01 supervisord: valheim-updater overlay / overlay rw,relatime,lowerdir=/mnt/.ix-apps/docker/overlay2/l/TKKR4725MTGSIPQF7XG23F4EMW:/mnt/.ix-apps/docker/overlay2/l/H2VOMFG3HG4POWOSEM34Z63H5Q:/mnt/.ix-apps/docker/overlay2/l/GPRJLLNOZI2GC76UQUVH4P6SSJ:/mnt/.ix-apps/docker/overlay2/l/H2L7VKVCFNAUIHOY2IO36XSIUO:/mnt/.ix-apps/docker/overlay2/l/FMHEHXGYDJKPCTPSK4JP5V534K:/mnt/.ix-apps/docker/overlay2/l/R65ZZQ54IFWTRQUICKHACSRX42:/mnt/.ix-apps/docker/overlay2/l/TYFQ3J7EM5AMSJXG3Y3WQQ5XXS:/mnt/.ix-apps/docker/overlay2/l/7SNEALD5CPJYSGGQYWDXRSA4OI,upperdir=/mnt/.ix-apps/docker/overlay2/5481fabb0f67b438ef7ab390169b2de347e78eebc2d7f4f24fe28d140b564648/diff,workdir=/mnt/.ix-apps/docker/overlay2/5481fabb0f67b438ef7ab390169b2de347e78eebc2d7f4f24fe28d140b564648/work 0 0

Nov 16 11:15:01 supervisord: valheim-updater STORAGE/DATA/Game_servers/valheim/config /config zfs rw,noatime,xattr,nfs4acl,casesensitive 0 0

Nov 16 11:15:01 supervisord: valheim-updater STORAGE/DATA/Game_servers/valheim/data /opt/valheim zfs rw,noatime,xattr,nfs4acl,casesensitive 0 0

Nov 16 11:15:01 supervisord: valheim-updater DEBUG - [46] - No players connected to Valheim server

Nov 16 11:15:01 supervisord: valheim-updater INFO - Downloading/updating/validating Valheim server from Steam

Nov 16 11:15:03 supervisord: valheim-updater Redirecting stderr to '/home/valheim/Steam/logs/stderr.txt'

Nov 16 11:15:03 supervisord: valheim-updater Logging directory: '/home/valheim/Steam/logs'

Nov 16 11:15:03 supervisord: valheim-updater [  0%] Checking for available updates...

Nov 16 11:15:03 supervisord: valheim-updater [----] Verifying installation...

Nov 16 11:15:03 supervisord: valheim-updater UpdateUI: skip show logo

Nov 16 11:15:03 supervisord: valheim-updater Steam Console Client (c) Valve Corporation - version 1759461699

Nov 16 11:15:03 supervisord: valheim-updater -- type 'quit' to exit --

Nov 16 11:15:03 supervisord: valheim-updater Loading Steam API...^[[0m

Nov 16 11:15:03 supervisord: valheim-updater IPC function call IClientUtils::GetSteamRealm took too long: 44 msec

Nov 16 11:15:03 supervisord: valheim-updater OK

Nov 16 11:15:03 supervisord: valheim-updater ^[[0m

Nov 16 11:15:03 supervisord: valheim-updater 

Nov 16 11:15:03 supervisord: valheim-updater Connecting anonymously to Steam Public...^[[0m

Nov 16 11:15:04 supervisord: valheim-updater OK

Nov 16 11:15:04 supervisord: valheim-updater ^[[0mWaiting for client config...^[[0m

Nov 16 11:15:05 supervisord: valheim-updater OK

Nov 16 11:15:05 supervisord: valheim-updater ^[[0m

Nov 16 11:15:05 supervisord: valheim-updater Waiting for user info...^[[0mOK

Nov 16 11:15:05 supervisord: valheim-updater ^[[0m

Nov 16 11:15:08 supervisord: valheim-updater  Update state (0x5) verifying install, progress: 38.00 (676750749 / 1780754080)

Nov 16 11:15:08 supervisord: valheim-updater ^[[0m

Nov 16 11:15:10 supervisord: valheim-updater  Update state (0x5) verifying install, progress: 81.27 (1447160160 / 1780754080)

Nov 16 11:15:10 supervisord: valheim-updater ^[[0m

Nov 16 11:15:11 supervisord: valheim-updater Success! App '896660' fully installed.

Nov 16 11:15:11 supervisord: valheim-updater ^[[0m

Nov 16 11:15:11 supervisord: valheim-updater Unloading Steam API...^[[0m

Nov 16 11:15:11 supervisord: valheim-updater OK

Nov 16 11:15:11 supervisord: valheim-updater ^[[0m

Nov 16 11:15:11 supervisord: valheim-updater .d..t...... ./

Nov 16 11:15:11 supervisord: valheim-updater INFO - Valheim Server is already the latest version

Nov 16 11:15:11 supervisord: valheim-updater DEBUG - [46] - ValheimPlus is enabled - running updater

Nov 16 11:15:12 supervisord: valheim-updater DEBUG - [3294] - Local ValheimPlus archive is identical to remote archive and was successfully installed - no update required

Nov 16 11:15:58 supervisord: valheim-server 11/16/2025 11:15:58: Console: [Info   : Unity Log] 11/16/2025 11:15:58: Available space to current user: 916220674048. Saving is blocked if below: 20205110 bytes. Warnings are given if below: 40410220

Nov 16 11:15:58 supervisord: valheim-server 11/16/2025 11:15:58: Available space to current user: 916220674048. Saving is blocked if below: 20205110 bytes. Warnings are given if below: 40410220

Nov 16 11:15:58 supervisord: valheim-server 11/16/2025 11:15:58: Console: [Info   : Unity Log] 11/16/2025 11:15:58: Sending message to save player profiles

Nov 16 11:15:58 supervisord: valheim-server 11/16/2025 11:15:58: Sending message to save player profiles

Nov 16 11:15:59 supervisord: valheim-server 11/16/2025 11:15:59: Console: [Info   : Unity Log] 11/16/2025 11:15:59: PrepareSave: clone done in 72ms

Nov 16 11:15:59 supervisord: valheim-server 11/16/2025 11:15:59: PrepareSave: clone done in 72ms

Nov 16 11:15:59 supervisord: valheim-server 11/16/2025 11:15:59: Console: [Info   : Unity Log] 11/16/2025 11:15:59: PrepareSave: ZDOExtraData.PrepareSave done in 36 ms

Nov 16 11:15:59 supervisord: valheim-server 11/16/2025 11:15:59: PrepareSave: ZDOExtraData.PrepareSave done in 36 ms

Nov 16 11:15:59 supervisord: valheim-server 11/16/2025 11:15:59: World save writing starting

Nov 16 11:15:59 supervisord: valheim-server 11/16/2025 11:15:59: World save writing started

Nov 16 11:15:59 supervisord: valheim-server 11/16/2025 11:15:59: Saved 172301 ZDOs

Nov 16 11:15:59 supervisord: valheim-server 11/16/2025 11:15:59: World save writing finishing

Nov 16 11:15:59 supervisord: valheim-server 11/16/2025 11:15:59: World save writing finished

Nov 16 11:15:59 supervisord: valheim-server 11/16/2025 11:15:59: World saved ( 677.317ms )

Nov 16 11:15:59 supervisord: valheim-server 11/16/2025 11:15:59: Considering autobackup. World time: 7196.297, short time: 7200, long time: 43200, backup count: 4

Nov 16 11:15:59 supervisord: valheim-server 11/16/2025 11:15:59: No autobackup needed yet...

Nov 16 11:16:02 supervisord: valheim-server [Info   :Valheim Plus] Saved 21468 map points to disk.

Nov 16 11:16:02 supervisord: valheim-server 11/16/2025 11:16:02: Console: [Info   :Valheim Plus] Saved 21468 map points to disk.

Nov 16 11:16:03 supervisord: valheim-server 11/16/2025 11:16:03: Console: [Info   : Unity Log] 11/16/2025 11:16:03: Unloading unused assets

Nov 16 11:16:03 supervisord: valheim-server 11/16/2025 11:16:03: Unloading unused assets

Nov 16 11:16:03 supervisord: valheim-server Unloading 0 Unused Serialized files (Serialized files now loaded: 18)

Nov 16 11:16:03 supervisord: valheim-server 11/16/2025 11:16:03: Console: [Info   : Unity Log] 11/16/2025 11:16:03:  Connections 0 ZDOS:172301  sent:0 recv:0

Nov 16 11:16:03 supervisord: valheim-server 11/16/2025 11:16:03:  Connections 0 ZDOS:172301  sent:0 recv:0

Nov 16 11:16:03 supervisord: valheim-server Unloading 0 unused Assets to reduce memory usage. Loaded Objects now: 207352.

Nov 16 11:16:03 supervisord: valheim-server Total: 200.065477 ms (FindLiveObjects: 19.600645 ms CreateObjectMapping: 18.914103 ms MarkObjects: 161.221694 ms  DeleteObjects: 0.328035 ms)

Nov 16 11:17:01 CRON[3350]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)

Nov 16 11:17:01 CRON[3351]: (root) CMD (   cd / && run-parts --report /etc/cron.hourly)

Nov 16 11:17:01 CRON[3350]: pam_unix(cron:session): session closed for user root

Nov 16 11:21:02 supervisord: valheim-server [Info   :Valheim Plus] Saved 21468 map points to disk.

Nov 16 11:21:02 supervisord: valheim-server 11/16/2025 11:21:02: Console: [Info   :Valheim Plus] Saved 21468 map points to disk.'
`;

  return (
    <Flex direction="column" gap={defaultGap}>
			
      <Flex direction={"row"} gap={defaultGap} justify={"between"}>
        
        <Flex direction={"column"} className="w-1/3" gap={defaultGap}>
          <Card>
            <Flex direction={"column"} gap={"2"} className="p-2">
              <Flex justify={"between"}>
                <Heading as="h2" mb="2" trim="start">Status</Heading>
                <Badge color="red">Offline</Badge>
              </Flex>
              <Flex gap={"2"}>
                <Button variant="surface" color="green">Run server</Button>
                <Button variant="surface" color="red" disabled={true}>Stop server</Button>
              </Flex>
              <Text as="p">Graczy online: {playerCount}</Text>
            </Flex>
          </Card>
        </Flex>

        <Flex direction={"column"} className="w-2/3" gap={defaultGap}>
          <Card>
            <Flex direction={"column"} gap={"2"} className="p-2">
              <Heading as="h2" mb="2" trim="start">Statystyki</Heading>
              <Flex gap={"2"}></Flex>
            </Flex>
          </Card>
        </Flex>
      </Flex>
			
      <Card>
        <Flex direction={"column"} gap={"2"} className="p-4">
          <Heading as="h2" mb="2" trim="start">Logi</Heading>
          <ScrollArea type="always" scrollbars="vertical" style={{ height: 180 }}>
            <Text as="p">
              {logs}
            </Text>
          </ScrollArea>
        </Flex>
      </Card>
		</Flex>
  );
}
