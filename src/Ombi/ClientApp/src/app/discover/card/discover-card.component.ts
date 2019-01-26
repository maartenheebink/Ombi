import { Component, OnInit, Input } from "@angular/core";
import { IDiscoverCardResult } from "../interfaces";
import { RequestType, ISearchTvResult, ISearchMovieResult } from "../../interfaces";
import { SearchService } from "../../services";

@Component({
    selector: "discover-card",
    templateUrl: "./discover-card.component.html",
    styleUrls: ["./discover-card.component.scss"],
})
export class DiscoverCardComponent implements OnInit {

    @Input() public result: IDiscoverCardResult;

    constructor(private searchService: SearchService) { }

    public ngOnInit() {
        if (this.result.type == RequestType.tvShow) {
            this.getExtraTvInfo();
        }
        if (this.result.type == RequestType.movie) {
            this.getExtraMovieInfo();
        }
    }

    public getExtraTvInfo() {
        this.searchService.getShowInformation(this.result.id)
            .subscribe(x => {
                if (x) {
                    this.setTvDefaults(x);
                    this.updateTvItem(x);
                }
            });
    }
    private getExtraMovieInfo() {
        this.searchService.getMovieInformation(this.result.id)
            .subscribe(m => {
                this.updateMovieItem(m);
            });
    }

    private updateMovieItem(updated: ISearchMovieResult) {
        this.result.url = "http://www.imdb.com/title/" + updated.imdbId + "/";  
        this.result.available = updated.available;
        this.result.requested = updated.requested;
        this.result.requested = updated.requestProcessing;
    }


    private setTvDefaults(x: ISearchTvResult) {
        if (!x.imdbId) {
            x.imdbId = "https://www.tvmaze.com/shows/" + x.seriesId;
        } else {
            x.imdbId = "http://www.imdb.com/title/" + x.imdbId + "/";
        }
    }

    private updateTvItem(updated: ISearchTvResult) {
        this.result.title = updated.title;
        this.result.id = updated.id;
        this.result.available = updated.fullyAvailable;
        this.result.posterPath = updated.banner;
        this.result.requested = updated.requested;
        this.result.url = updated.imdbId;
    }

}