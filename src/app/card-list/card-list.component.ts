import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { ApiMockService } from "../data-access/api-mock.service";
import { concatMap, from, Observable, tap } from "rxjs";
import { CategoryMeta, Poll, PollCategory } from "../data-access/types";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-root-card-list',
  standalone: true,
  imports: [ CardComponent, HttpClientModule, FormsModule, CommonModule ],
  animations: [ ViewEncapsulation.None ],
  providers: [ ApiMockService, HttpClient ],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit{

  pollList: Poll[] = [];

  pollListWithMeta: Poll[] & PollCategory[] & CategoryMeta[] = [];

  pollListWithMetaBuff: Poll[] & PollCategory[] & CategoryMeta[] = [];
  categories: PollCategory[] = [];
  categoryMeta: CategoryMeta[] = [];

  isLoading = false;

  constructor( private apiService: ApiMockService) {}

  ngOnInit() {
    this.getAllInfo();
  }

  getAllInfo(){
    from([this.getPolls(), this.getCategories(), this.getCategoryMeta()]).pipe(
      concatMap((resp: Observable<Poll[]> | Observable<PollCategory[]> | Observable<CategoryMeta[]>) => resp  )).subscribe(
      () => this.getFullObject()
    )
  }

  getPolls(): Observable<Poll[]>{
    return this.apiService.getPolls().pipe(
      tap((resp: Poll[]) => this.pollList = resp)
    )
  }

  getCategories(): Observable<PollCategory[]>{
    return this.apiService.getCategories().pipe(
      tap((resp: PollCategory[]) => this.categories = resp)
    )
  }

  getCategoryMeta(): Observable<CategoryMeta[]>{
    return this.apiService.getCategoriesMeta().pipe(
      tap((resp: CategoryMeta[]) => this.categoryMeta = resp)
    )
  }
  getFullObject(){
    this.pollList.forEach((el, index) => {
      // @ts-ignore
      this.pollListWithMeta[index] = Object.assign(el, this.categories.find((obj) =>obj.id === el.category_id), this.categoryMeta.find((obj) => obj.alias === this.categories.find((obj) =>obj.id === el.category_id).alias ))
    })
    this.pollListWithMetaBuff = this.pollListWithMeta;
    this.isLoading = true;
  }

  sortForAlias(value: string){
    // @ts-ignore
    this.pollListWithMeta = this.pollListWithMetaBuff.filter((el: Poll & PollCategory & CategoryMeta) => this.isCategory(value, el.category_id.toString()));
  }

  isCategory(category: string, currentCategory: string){
    return category === currentCategory
  }
}
