import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Exits } from 'src/app/models/exits.model';
import { DataService } from 'src/app/services/data.service';
import { ConfirmationService, MessageService, ConfirmEventType, PrimeNGConfig } from 'primeng/api';


@Component({
  selector: 'app-exits-page',
  templateUrl: './exits-page.component.html',
  styleUrls: ['./exits-page.component.css']
})
export class ExitsPageComponent {
  public form: FormGroup;
  public busy = false;
  public pt: any;
  public exits: Exits[] = [];
  public exitId: any;
  public name: any;
  public ptBR: any;
  public currentMonthExits: Exits[] = [];
  public filteredExits: Exits[] = [];
  public startDate: any;
  public endDate: any;
  public searchQuery: string = '';
  public clonedProducts: { [s: string]: Exits } = {};
  public selectedExits!: Exits;
  public updating: boolean = false;

  constructor(
    private primengConfig: PrimeNGConfig,
    private service: DataService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {

    this.form = this.fb.group({
      description: ['', Validators.compose([
        Validators.required
      ])],
      value: ['', Validators.compose([
        Validators.required
      ])],
      date: ['', Validators.compose([
        Validators.required
      ])]
    });

    this.ptBR = {
      firstDayOfWeek: 0,
      dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      dayNamesMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa"],
      monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      today: 'Hoje',
      clear: 'Limpar'
    };
  }

  ngOnInit() {
    this.listExits();
    this.primengConfig.setTranslation(this.ptBR);
  };

  resetForm() {
    this.form.reset();
  }

  submit() {
    this.busy = true;
    this
      .service
      .createExits(this.form.value)
      .subscribe({
        next: (data: any) => {
          this.busy = false;
          this.toastr.success(data.message, 'Saida cadastrada');
          this.listExits();
          this.resetForm();
          console.log();
        },
        error: (err: any) => {
          console.log(err);
          this.toastr.error(err.message, 'Erro ao cadastrar saída');
          this.busy = false;
        }
      }

      );
  }

  searchDate() {
    if (this.startDate && this.endDate) {
      this.getExitsByDateRange(this.startDate, this.endDate);
    } else {
      this.listExits();
    }
  }

  getExitsByDateRange(startDate: string, endDate: string) {
    this.busy = true;
    this.service.getExits().subscribe(
      (data: any) => {
        this.busy = false;
        const start = new Date(startDate);
        const end = new Date(endDate);
        this.exits = data.filter((exit: Exits) => {
          const date = new Date(exit.date);
          return date >= start && date <= end;
        });
      }
    );
  }

  listExits() {
    this.service.getExits().subscribe((data: any) => {
      this.busy = false;
      this.exits = data.filter((exit: Exits) => {
        const exitDate = new Date(exit.date);
        const currentDate = new Date();
        return exitDate.getMonth() === currentDate.getMonth();
      });
    });
  }

  getExitsById(id: any) {
    this
      .service
      .getExitsById(id)
      .subscribe(
        (data: any) => {
          this.busy = false;
          this.exitId = data._id
          this.form.patchValue(data);
          console.log(data._id);
        }
      );

  }

  onRowEditInit(exits: Exits) {
    if (exits) {
      {
        this.selectedExits = { ...exits };
        this.form.controls['title'].setValue(exits.description);
        this.form.controls['quantity'].setValue(exits.value);
        this.form.controls['purchasePrice'].setValue(exits.date)
      };
    }
  }


  onRowEditSave(exits: Exits) {
    this.updating = false;
    const index = this.exits.findIndex(p => p._id === exits._id);
    const updatedExits = { id: exits._id, ...this.selectedExits };
    this.service.updateExits(updatedExits).subscribe({
      next: (data: any) => {
        this.exits[index] = data.exits;
        this.toastr.success(data.message, 'Saída atualizada atualizado');
        this.listExits();
        this.updating = true;
      },
      error: (err: any) => {
        console.log(err);
        this.toastr.error(err.message, 'Erro ao atualizar saída');
      }
    });
  }

  onRowEditCancel(exits: Exits) {
    const index = this.exits.findIndex(p => p._id === exits._id);
    this.exits[index] = this.selectedExits;
    this.selectedExits;
    this.listExits();
  }

  delete(id: any) {
    this
      .service
      .delExits(id)
      .subscribe(
        (data: any) => {
          this.busy = false;
          this.toastr.success(data.message, 'Saída deletada com sucesso');
          this.listExits();
          console.log(data);
        },
        (err: any) => {
          this.toastr.error(err.message, 'Erro ao deletar saída');
          this.busy = false;
          console.log(err);
        }

      );
  }

  search() {
    if (this.name == "") {
      this.ngOnInit();
    } else {
      this.exits = this.exits.filter(res => {
        return res.description.toLocaleLowerCase().match(this.name.toLocaleLowerCase());
      })
    }
  }


  clearSearch() {
    this.startDate = null;
    this.endDate = null;
    this.listExits();
  }
}
