export class DateTimeUtils {

    static now(): number {
        return new Date().getTime();
    }

    static formatDuration(duration: number) {
        function format(value: number) {
            return ("0" + value).slice(-2);
        }

        let seconds = duration / 1000;
        const hours = Math.floor(seconds / 3600);
        seconds = seconds % 3600;
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);

        return (hours > 0 ? `${hours}:` : '') + format(minutes) + ':' + format(seconds);
    }

}
